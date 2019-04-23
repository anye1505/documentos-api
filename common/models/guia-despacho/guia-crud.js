
let fs = require('fs');
let uuid = require('uuid');
let path = require('path');
let Hooks = require('../../../helpers/hooks');
let Files = require('../../../helpers/files');

module.exports = (GuiaDespacho) => {
    GuiaDespacho.beforeRemote('asignarDocumentosFile', Hooks.beforeRemoteFormData);

    /*cuerpo*/
    GuiaDespacho.buscar = (gud_id,options, next) => {
        var ds = GuiaDespacho.dataSource;
        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select g.*, to_char(g.gud_fecha_creacion,'yyyy-MM-dd')::text AS fecha_creacion, to_char(g.gud_fecha_despacho,'yyyy-MM-dd')::text AS fecha_despacho, to_char(g.gud_fecha_recepcion,'yyyy-MM-dd')::text AS fecha_recepcion, ge.gde_descripcion, upper(u.name ||coalesce(' ' ||u.surname,'')) ::text AS despachador ";
                sql = sql + " , vs.courier_nombre||' - ' ||vs.sucursal_nombre AS nombresuc, vs.sucursal_distrito, courier_nombre, sucursal_nombre, to_char(now(), 'dd/MM/yyyy HH24:MI')::text AS fechaactual ";
                sql = sql + " from proceso.guia_despacho g join proceso.guia_despacho_estado ge on ge.gde_id = g.gde_id  join seguridad.user u on g.gud_usuario_crea=u.id ";
                sql = sql + " join general.vista_sucursal vs on vs.sucursal_id=g.suc_id ";
                sql = sql + " left join general.vista_transportista vt on vt.tra_id=g.tra_id ";
                //sql = sql + " left join general.vista_mensajero mjro on mjro.men_id = g.men_id ";
                sql = sql + " where g.gud_id=$1 ";
            
                ds.connector.execute(sql, [gud_id], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });   
            })
        })
        .catch(function(err){
            console.log(err); next("Ocurrio un error al recuperar los datos de la guia.");   
        });
    };
    GuiaDespacho.guardar = (gud_id,suc_id,tra_id,gui_trans,options, next) => {
        var ds = GuiaDespacho.dataSource;
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const usu_id = valores && valores.userId;
        
        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select * from proceso.spu_guia_despacho_actualizar($1,$2,$3,$4,$5);";
                ds.connector.execute(sql, [
                    gud_id,suc_id,tra_id,gui_trans.toString(),usu_id
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
    /*GuiaDespacho.guardar = (gud_id,suc_id,tra_id,gui_trans,options, next) => {
        var ds = Guia.dataSource;
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const usu_id = valores && valores.userId;

        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select * from proceso.spu_guia_despacho_actualizar($1,$2,$3,$4,$5);";
                ds.connector.execute(sql, [
                    gud_id,suc_id,tra_id,gui_trans,usu_id
                ], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });   
            });
        })
        .catch(function(err){
          console.log(err); next("Ocurrio un error al guardar la guia.");   
        });
    };*/
    GuiaDespacho.eliminar = (gud_id,options, next) => {
        var ds = GuiaDespacho.dataSource;
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const usu_id = valores && valores.userId;

        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select * from proceso.spu_guia_despacho_eliminar($1,$2);";
                ds.connector.execute(sql, [gud_id,usu_id], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });   
            })
        })
        .catch(function(err){
            console.log(err); next("Ocurrio un error al eliminar la guia.");   
        });
    };
    GuiaDespacho.resetear = (gud_id,options, next) => {
        var ds = GuiaDespacho.dataSource;
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const usu_id = valores && valores.userId;

        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select * from proceso.spu_guia_despacho_resetear($1,$2);";
                ds.connector.execute(sql, [gud_id,usu_id], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });   
            })
        })
        .catch(function(err){
            console.log(err); next("Ocurrio un error al resetear la guia.");   
        });
    };
    /*GuiaDespacho.entregar = (gui_id,men_id,pasaje,options, next) => {
        var ds = GuiaDespacho.dataSource;
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
    };*/
    GuiaDespacho.despachar = (gud_id,tra_id,gui_trans,fechadesp,options, next) => {
        var ds = GuiaDespacho.dataSource;
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const usu_id = valores && valores.userId;

        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select * from proceso.spu_guia_despacho_despachar($1,$2,$3,$4,$5);";
                ds.connector.execute(sql, [gud_id,tra_id,gui_trans,fechadesp,usu_id], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });   
            })
        })
        .catch(function(err){
            console.log(err); next("Ocurrio un error al recuperar los datos de la guia.");   
        });
    };
    GuiaDespacho.asignarRango = (gud_id,suc_id,agregar,cod_barra_inicial,cod_barra_final,options, next) => {
        var ds = GuiaDespacho.dataSource;
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const usu_id = valores && valores.userId;

        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select * from proceso.spu_guia_despacho_asignar_documento_rango($1,$2,$3,$4,$5,$6);";
                ds.connector.execute(sql, [gud_id,suc_id,agregar,cod_barra_inicial,cod_barra_final,usu_id], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });   
            })
        })
        .catch(function(err){
            console.log(err); next("Ocurrio un error al asignar el/los documento(s) la guia.");   
        });
    };
    GuiaDespacho.asignarDocumentosFile = (gud_id,suc_id,agregar,file,options, next) => {
        var ds = GuiaDespacho.dataSource;
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
		      	let destPath = path.join(GuiaDespacho.app.get("path").guias.asignacion_documentos, desFileName);
                //console.log('destPath', destPath);                
				fs.copyFile(file.path, destPath, (err) => {
					if (err) {
						reject(err);
					}else{
						let sql = "";
                        sql = "select * from proceso.sp_guia_despacho_asignar_archivo($1,$2,$3,$4,$5)";
                        ds.connector.execute(sql, [gud_id,suc_id,agregar,desFileName,usu_id], function(err, data) {
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
    GuiaDespacho.asignarDocumentosValidar = (gud_id,suc_id,agregar,cod_barra,emp_id,options, next) => {
        var ds = GuiaDespacho.dataSource;
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const usu_id = valores && valores.userId;

        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select * from proceso.spu_guia_despacho_asignar_validar_doc($1,$2,$3,$4,$5,$6);";
                ds.connector.execute(sql, [gud_id,suc_id,agregar,cod_barra,usu_id,emp_id], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });   
            })
        })
        .catch(function(err){
            console.log(err); next("Ocurrio un error al asignar el/los documento/s a la guia.");   
        });
    };
    GuiaDespacho.asignarDocumentos = (gud_id,suc_id,agregar,cod_barra,options, next) => {
        var ds = GuiaDespacho.dataSource;
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const usu_id = valores && valores.userId;

        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select * from proceso.spu_guia_despacho_asignar_documento($1,$2,$3,$4,$5);";
                ds.connector.execute(sql, [gud_id,suc_id,agregar,cod_barra,usu_id], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });   
            })
        })
        .catch(function(err){
            console.log(err); next("Ocurrio un error al asignar el/los documento/s a la guia.");   
        });
    };
    GuiaDespacho.asignarDocumentosVarios = (gud_id,suc_id,agregar,cod_barra,options, next) => { 
        var ds = GuiaDespacho.dataSource;
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const usu_id = valores && valores.userId;

        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select * from proceso.spu_guia_despacho_asignar_documentos($1,$2,$3,$4,$5);";
                ds.connector.execute(sql, [gud_id,suc_id,agregar,cod_barra,usu_id], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });   
            })
        })
        .catch(function(err){
            console.log(err); next("Ocurrio un error al asignar el/los documento/s a la guia.");   
        });
    };
    GuiaDespacho.quitarDocumento = (gud_id,doc_id,options, next) => {
        var ds = GuiaDespacho.dataSource;
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const usu_id = valores && valores.userId;

        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select * from proceso.spu_guia_quitar_documento($1,$2,$3);";
                ds.connector.execute(sql, [gud_id,doc_id,usu_id], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });   
            })
        })
        .catch(function(err){
            console.log(err); next("Ocurrio un error al eliminar el documento asignado a la guia.");   
        });
    };
    GuiaDespacho.recepcionar = (guia_id,fecha,options, next) => {
        var ds = GuiaDespacho.dataSource;
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const usu_id = valores && valores.userId;

        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select * from proceso.spu_guia_despacho_recepcionar($1,$2,$3);";
                ds.connector.execute(sql, [guia_id,fecha,usu_id], function(err, data) {
                    if (err){ reject(err); }
                    else{ console.log("data recep:",data);next(null,data); }
                });   
            })
        })
        .catch(function(err){
            console.log(err); next("Ocurrio un error al asignar el/los documento/s a la guia.");   
        });
    };
    /*Definicion*/
    GuiaDespacho.remoteMethod('guardar', {
    accepts: [        
        {arg: "gud_id", type: "number", required: true },
        {arg: "suc_id", type: "number", required: true },
        {arg: "tra_id", type: "number", required: true },
        {arg: "gui_trans", type: "string", required: false },
        {arg: "options", type: "object", 'http': "optionsFromRequest"}
    ],
    returns: {
        arg: 'response',
        type: 'object',
        root: true
    },
    http: {
        verb: 'POST',
        path: '/guardar'
    }
    });
    GuiaDespacho.remoteMethod('buscar', {
        accepts: [        
            {arg: "gud_id", type: "number", required: true },
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
    GuiaDespacho.remoteMethod('eliminar', {
        accepts: [        
            {arg: "gud_id", type: "number", required: true },
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
    GuiaDespacho.remoteMethod('resetear', {
        accepts: [        
            {arg: "gud_id", type: "number", required: true },
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
    /*GuiaDespacho.remoteMethod('entregar', {
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
    });*/
    GuiaDespacho.remoteMethod('despachar', {
        accepts: [        
            {arg: "gud_id", type: "number", required: true },
            {arg: "tra_id", type: "number", required: true },
            {arg: "gui_trans", type: "string", required: false },
            {arg: "fechadesp", type: "string", required: true },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
            arg: 'response',
            type: 'object',
            root: true
        },
        http: {
            verb: 'GET',
            path: '/despachar'
        }
    });
    GuiaDespacho.remoteMethod('asignarRango', {
        accepts: [        
            {arg: "gud_id", type: "number", required: true },
            {arg: "suc_id", type: "number", required: true },
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
    GuiaDespacho.remoteMethod('asignarDocumentosFile', {
        accepts: [        
            {arg: "gud_id", type: "string", required: true },
            {arg: "suc_id", type: "string", required: true },
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
    GuiaDespacho.remoteMethod('asignarDocumentos', {
        accepts: [        
            {arg: "gud_id", type: "number", required: true },
            {arg: "suc_id", type: "number", required: true },
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
    GuiaDespacho.remoteMethod('asignarDocumentosValidar', {
        accepts: [        
            {arg: "gud_id", type: "number", required: true },
            {arg: "suc_id", type: "number", required: true },
            {arg: "agregar", type: "boolean", required: true },
            {arg: "cod_barra", type: "string", required: true },
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
    GuiaDespacho.remoteMethod('asignarDocumentosVarios', {
        accepts: [        
            {arg: "gud_id", type: "number", required: true },
            {arg: "suc_id", type: "number", required: true },
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
    GuiaDespacho.remoteMethod('quitarDocumento', {
        accepts: [        
            {arg: "gud_id", type: "number", required: true },
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
    GuiaDespacho.remoteMethod('recepcionar', {
        accepts: [        
            {arg: "guia_id", type: "number", required: true },
            {arg: "fecha", type: "string", required: true },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
            arg: 'response',
            type: 'object',
            root: true
        },
        http: {
            verb: 'GET',
            path: '/recepcionar'
        }
    });
}