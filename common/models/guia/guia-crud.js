
let fs = require('fs');
let uuid = require('uuid');
let path = require('path');
let Hooks = require('../../../helpers/hooks');
let Files = require('../../../helpers/files');

module.exports = (Guia) => {
    Guia.beforeRemote('asignarDocumentosFile', Hooks.beforeRemoteFormData);

    /*cuerpo*/
    Guia.buscar = (gui_id,options, next) => {
        var ds = Guia.dataSource;
        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select g.*, to_char(g.gui_fecha_creacion,'yyyy-MM-dd')::text AS fecha_creacion, to_char(g.gui_fecha_entrega,'yyyy-MM-dd')::text AS fecha_entrega, to_char(g.gui_fecha_cierre,'yyyy-MM-dd')::text AS fecha_cierre, ge.gue_descripcion,upper(u.name ||coalesce(' ' ||u.surname,'')) ::text AS despachador ";
                sql = sql + " , mjro.men_nombre, d.distrito_nombre, courier_nombre, sucursal_nombre, to_char(now(),'dd/MM/yyyy HH24:MI')::text AS fechaactual ";
                sql = sql + " from  proceso.guia g join proceso.guia_estado ge on ge.gue_id = g.gue_id  join seguridad.user u on g.gui_usuario_crea=u.id ";
                sql = sql + " join general.vista_sucursal vs on vs.sucursal_id=g.suc_id ";
                sql = sql + " left join general.vista_mensajero mjro on mjro.men_id = g.men_id ";
                sql = sql + " left join ( ";
                sql = sql + " select s.suc_id, sa.sam_id ,u.ubi_nom_departamento || '-' ||u.ubi_nom_provincia || '-' ||u.ubi_nom_distrito distrito_nombre ";
                sql = sql + " from general.sucursal_ambito sa inner join geo.ubigeo u on sa.ubi_id_distrito=u.ubi_id_distrito  inner join general.sucursal s ";
                sql = sql + " on sa.suc_id=s.suc_id ";
                sql = sql + " ) d on d.suc_id=g.suc_id and d.sam_id=g.sam_id ";
                sql = sql + " where g.gui_id=$1 ";
            
                ds.connector.execute(sql, [gui_id], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });   
            })
        })
        .catch(function(err){
            console.log(err); next("Ocurrio un error al recuperar los datos de la guia.");   
        });
    };
    Guia.guardar = (guia_id,sam_id,men_id,options, next) => {
        var ds = Guia.dataSource;
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const usu_id = valores && valores.userId;

        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select * from proceso.spu_guia_actualizar($1,$2,$3,$4);";
                ds.connector.execute(sql, [
                    guia_id,sam_id,men_id,usu_id
                ], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });   
            });
        })
        .catch(function(err){
          console.log(err); next("Ocurrio un error al guardar la guia.");   
        });
    };
    Guia.eliminar = (gui_id,options, next) => {
        var ds = Guia.dataSource;
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const usu_id = valores && valores.userId;

        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select * from proceso.spu_guia_eliminar($1,$2);";
                ds.connector.execute(sql, [gui_id,usu_id], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });   
            })
        })
        .catch(function(err){
            console.log(err); next("Ocurrio un error al eliminar la guia.");   
        });
    };
    Guia.resetear = (gui_id,options, next) => {
        var ds = Guia.dataSource;
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const usu_id = valores && valores.userId;

        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select * from proceso.spu_guia_resetear($1,$2);";
                ds.connector.execute(sql, [gui_id,usu_id], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });   
            })
        })
        .catch(function(err){
            console.log(err); next("Ocurrio un error al resetear la guia.");   
        });
    };
    Guia.entregar = (gui_id,men_id,pasaje,options, next) => {
        var ds = Guia.dataSource;
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const usu_id = valores && valores.userId;

        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select * from proceso.spu_guia_entregar($1,$2,$3,$4);";
                ds.connector.execute(sql, [gui_id,men_id,pasaje,usu_id], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });   
            })
        })
        .catch(function(err){
            console.log(err); next("Ocurrio un error al recuperar los datos de la guia.");   
        });
    };
    Guia.asignarRango = (gui_id,sac_id,agregar,cod_barra_inicial,cod_barra_final,options, next) => {
        var ds = Guia.dataSource;
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const usu_id = valores && valores.userId;

        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select * from proceso.spu_guia_asignar_documento_rango($1,$2,$3,$4,$5,$6);";
                ds.connector.execute(sql, [gui_id,sac_id,agregar,cod_barra_inicial,cod_barra_final,usu_id], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });   
            })
        })
        .catch(function(err){
            console.log(err); next("Ocurrio un error al asignar el/los documento(s) la guia.");   
        });
    };
    Guia.asignarDocumentosFile = (gui_id,sac_id,agregar,file,options, next) => {
        var ds = Guia.dataSource;
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const usu_id = valores && valores.userId;

        let desFileName = ''; 
        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                let filename = file.name;// uuid.v1() + file.name.substring(file.name.lastIndexOf('.'));
                //console.log('filename', filename);
                desFileName = uuid.v1()+"_"+filename;
                //console.log('desFileName', desFileName);
		      	let destPath = path.join(Guia.app.get("path").guias.asignacion_documentos, desFileName);
                //console.log('destPath', destPath);
				fs.copyFile(file.path, destPath, (err) => {
					if (err) {
						reject(err);
					}else{
						let sql = "";
                        sql = "select * from  proceso.sp_guia_asignar_archivo($1,$2,$3, $4, $5);";
                        ds.connector.execute(sql, [gui_id,sac_id,agregar,desFileName,usu_id], function(err, data) {
                            if (err){
                                reject(err);      
                            }else{
                                next(null, data);
                            }			          
                        });
					}
                });
            })
        })
        .catch(function(err){
            console.log(err); next("Ocurrio un error al asignar el/los documento/s a la guia.");   
        });
    };
    Guia.asignarDocumentosValidar = (gui_id,sac_id,agregar,cod_barra,suc_id,emp_id,options, next) => {
        var ds = Guia.dataSource;
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const usu_id = valores && valores.userId;

        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select * from proceso.spu_guia_asignar_validar_doc($1,$2,$3,$4,$5,$6,$7);";
                ds.connector.execute(sql, [gui_id,sac_id,agregar,cod_barra,usu_id,suc_id,emp_id], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });   
            })
        })
        .catch(function(err){
            console.log(err); next("Ocurrio un error al asignar el/los documento/s a la guia.");   
        });
    };
    Guia.asignarDocumentos = (gui_id,sac_id,agregar,cod_barra,options, next) => {
        var ds = Guia.dataSource;
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const usu_id = valores && valores.userId;

        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select * from proceso.spu_guia_asignar_documento($1,$2,$3,$4,$5);";
                ds.connector.execute(sql, [gui_id,sac_id,agregar,cod_barra,usu_id], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });   
            })
        })
        .catch(function(err){
            console.log(err); next("Ocurrio un error al asignar el/los documento/s a la guia.");   
        });
    };
    Guia.asignarDocumentosVarios = (gui_id,sac_id,agregar,cod_barra,options, next) => {
        var ds = Guia.dataSource;
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const usu_id = valores && valores.userId;

        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select * from proceso.spu_guia_asignar_documentos($1,$2,$3,$4,$5);";
                ds.connector.execute(sql, [gui_id,sac_id,agregar,cod_barra,usu_id], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });   
            })
        })
        .catch(function(err){
            console.log(err); next("Ocurrio un error al asignar el/los documento/s a la guia.");   
        });
    };
    Guia.quitarDocumento = (gui_id,doc_id,options, next) => {
        var ds = Guia.dataSource;
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const usu_id = valores && valores.userId;

        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select * from proceso.spu_guia_quitar_documento($1,$2,$3);";
                ds.connector.execute(sql, [gui_id,doc_id,usu_id], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });   
            })
        })
        .catch(function(err){
            console.log(err); next("Ocurrio un error al eliminar el documento asignado a la guia.");   
        });
    };
    /*Definicion*/
    Guia.remoteMethod('guardar', {
    accepts: [        
        {arg: "guia_id", type: "string", required: true },
        {arg: "sam_id", type: "string", required: true },
        {arg: "men_id", type: "number", required: true },
        {arg: "options", type: "object", 'http': "optionsFromRequest"}
    ],
    returns: {
        arg: 'response',
        type: 'object',
        root: true
    },
    http: {
        verb: 'GET',
        path: '/guardar'
    }
    });
    Guia.remoteMethod('buscar', {
        accepts: [        
            {arg: "gui_id", type: "number", required: true },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
            arg: 'response',
            type: 'object',
            root: true
        },
        http: {
            verb: 'GET',
            path: '/buscar'
        }
    });
    Guia.remoteMethod('eliminar', {
        accepts: [        
            {arg: "gui_id", type: "number", required: true },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
            arg: 'response',
            type: 'object',
            root: true
        },
        http: {
            verb: 'GET',
            path: '/eliminar'
        }
    });
    Guia.remoteMethod('resetear', {
        accepts: [        
            {arg: "gui_id", type: "number", required: true },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
            arg: 'response',
            type: 'object',
            root: true
        },
        http: {
            verb: 'GET',
            path: '/resetear'
        }
    });
    Guia.remoteMethod('entregar', {
        accepts: [        
            {arg: "gui_id", type: "number", required: true },
            {arg: "men_id", type: "number", required: true },
            {arg: "pasaje", type: "number", required: true },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
            arg: 'response',
            type: 'object',
            root: true
        },
        http: {
            verb: 'GET',
            path: '/entregar'
        }
    });
    Guia.remoteMethod('asignarRango', {
        accepts: [        
            {arg: "gui_id", type: "number", required: true },
            {arg: "sac_id", type: "number", required: true },
            {arg: "agregar", type: "boolean", required: true },
            {arg: "cod_barra_inicial", type: "string", required: true },
            {arg: "cod_barra_final", type: "string", required: true },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
            arg: 'response',
            type: 'object',
            root: true
        },
        http: {
            verb: 'GET',
            path: '/asignarRango'
        }
    });
    Guia.remoteMethod('asignarDocumentosFile', {
        accepts: [        
            {arg: "gui_id", type: "string", required: true },
            {arg: "sac_id", type: "string", required: true },
            {arg: "agregar", type: "string", required: true },
            {arg: "file", type: "object", required: true },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
            arg: 'response',
            type: 'object',
            root: true
        },
        http: {
            verb: 'POST',
            path: '/asignarDocumentosFile'
        }
    });
    Guia.remoteMethod('asignarDocumentos', {
        accepts: [        
            {arg: "gui_id", type: "number", required: true },
            {arg: "sac_id", type: "number", required: true },
            {arg: "agregar", type: "boolean", required: true },
            {arg: "cod_barra", type: "string", required: true },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
            arg: 'response',
            type: 'object',
            root: true
        },
        http: {
            verb: 'POST',
            path: '/asignarDocumentos'
        }
    });
    Guia.remoteMethod('asignarDocumentosValidar', {
        accepts: [        
            {arg: "gui_id", type: "number", required: true },
            {arg: "sac_id", type: "number", required: true },
            {arg: "agregar", type: "boolean", required: true },
            {arg: "cod_barra", type: "string", required: true },
            {arg: "suc_id", type: "number", required: true },
            {arg: "emp_id", type: "number", required: true },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
            arg: 'response',
            type: 'object',
            root: true
        },
        http: {
            verb: 'POST',
            path: '/asignarDocumentosValidar'
        }
    });
    Guia.remoteMethod('asignarDocumentosVarios', {
        accepts: [        
            {arg: "gui_id", type: "number", required: true },
            {arg: "sac_id", type: "number", required: true },
            {arg: "agregar", type: "boolean", required: true },
            {arg: "cod_barra", type: "string", required: true },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
            arg: 'response',
            type: 'object',
            root: true
        },
        http: {
            verb: 'POST',
            path: '/asignarDocumentosVarios'
        }
    });
    Guia.remoteMethod('quitarDocumento', {
        accepts: [        
            {arg: "gui_id", type: "number", required: true },
            {arg: "doc_id", type: "number", required: true },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
            arg: 'response',
            type: 'object',
            root: true
        },
        http: {
            verb: 'GET',
            path: '/quitarDocumento'
        }
    });
}