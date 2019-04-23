let fs = require('fs');
let uuid = require('uuid');
let path = require('path');
const async = require('async');
let Hooks = require('../../../helpers/hooks');
let Files = require('../../../helpers/files');

module.exports = (Gestion) => {
    Gestion.beforeRemote('descargarDocumentosFile', Hooks.beforeRemoteFormData);
    Gestion.beforeRemote('descargarMasivoDocumentosFile', Hooks.beforeRemoteFormData);
    Gestion.beforeRemote('actualizargestionFile', Hooks.beforeRemoteFormData);


    Gestion.descargardocumentos = (datosDescarga,options, next) => {
        var ds = Gestion.dataSource;
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const usu_id = valores && valores.userId;

        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select * from proceso.spu_descargar_codigo_barra_multiple($1,$2);";
                console.log("antes del select");
                ds.connector.execute(sql, [usu_id,datosDescarga], function(err, data) {
                    if (err){console.log("error:",err); reject(err); }
                    else{console.log("despues del select:",data); next(null,data); }
                });   
            })
        })
        .catch(function(err){
            console.log(err); next("Ocurrio un error al descargar el/los documento/s.");   
        });
    };
    // Gestion.descargardocumentos = (fecha_entrega,ges_id,cod_barra,men_id,fecha_entrega_cargo,options, next) => {//(datosDescarga,options, next) => {//(fecha_entrega,ges_id,cod_barra,men_id,fecha_entrega_cargo,options, next) => {
    //     var ds = Gestion.dataSource;
    //     const valores = options && options.accessToken;
    //     const token = valores && valores.id;
    //     const usu_id = valores && valores.userId;

    //     Promise.resolve().then(()=>{
    //         return new Promise(function(resolve, reject) {
    //             var sql = "select * from proceso.spu_descargar_codigo_barra($1,$2,$3,$4,$5,$6);";
    //             ds.connector.execute(sql, [usu_id,fecha_entrega,ges_id,cod_barra,men_id,fecha_entrega_cargo], function(err, data) {
    //                 if (err){ reject(err); }
    //                 else{ next(null,data); }
    //             });   
    //         })
    //     })
    //     .catch(function(err){
    //         console.log(err); next("Ocurrio un error al descargar el/los documento/s.");   
    //     });
    // };
    Gestion.descargarDocumentosFile = (fecha_entrega,ges_id,men_id,fecha_entrega_cargo,file,options, next) => {
        var ds = Gestion.dataSource;
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
		      	let destPath = path.join(Gestion.app.get("path").gestion.descarga_documentos, desFileName);
                //console.log('destPath', destPath);                
				fs.copyFile(file.path, destPath, (err) => {
					if (err) {
						reject(err);
					}else{
						let sql = "";
                        sql = "select * from proceso.sp_descargar_archivo($1,$2,$3,$4,$5,$6)";
                        ds.connector.execute(sql, [usu_id,fecha_entrega,ges_id,desFileName,men_id,fecha_entrega_cargo], function(err, data) {
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
            console.log(err); next("Ocurrio un error al descargar el/los documento/s.");   
        });
    };
    Gestion.descargarMasivoDocumentosFile = (file,options, next) => {
        var ds = Gestion.dataSource;
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const usu_id = valores && valores.userId;

        let desFileName = ''; 
        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                let filename = file.name;
                desFileName = uuid.v1()+"_"+filename;
		      	let destPath = path.join(Gestion.app.get("path").gestion.descarga_documentos, desFileName);             
				fs.copyFile(file.path, destPath, (err) => {
					if (err) {
						reject(err);
					}else{console.log("antes del select:",usu_id,);
						let sql = "";
                        sql = "select * from proceso.sp_descarga_masiva($1,$2)";
                        ds.connector.execute(sql, [usu_id,desFileName], function(err, data) {
                            if (err){
                                reject(err);      
                            }else{
                                console.log("despues del select:",usu_id,);
                                next(null, data);
                            }			          
                        });
					}
                });
            })
        })
        .catch(function(err){
            console.log(err); next("Ocurrio un error al descargar el/los documento/s.");   
        });
    };
    Gestion.actualizargestion = (fecha_entrega,ges_id,cod_barra,options, next) => {
        var ds = Gestion.dataSource;
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const usu_id = valores && valores.userId;
        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select * from proceso.spu_cambio_gestion_ind($1,$2,$3,$4);";
                ds.connector.execute(sql, [
                    cod_barra,usu_id,fecha_entrega,ges_id
                ], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });   
            });
        })
        .catch(function(err){
          console.log(err); next("Ocurrio un error al cambiar la gestión.");   
        });

    }
    /*Gestion.actualizargestion = (fecha_entrega,ges_id,cod_barra,options, next) => {//spu_cambio_gestion_ind()
        var ds = Gestion.dataSource;
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const usu_id = valores && valores.userId;
        let cod_barras = cod_barra.split(',');
        let arrayError = [];
        let cod_barras_funcion = [];
        async.eachSeries(cod_barras, function(cod_barra, callback){						
            ds.connector.execute("select * from proceso.documento where doc_id is not null and codigo_barra = '"+cod_barra+"';", function(err, data) {
                if (err) {
                    callback(err);
                } else {
                    if(data.length == 0){
                        arrayError.push({codigo_barra:cod_barra, observacion:"EL documento no fue identificado"})
                        callback();
                    }else{
                        ds.connector.execute("select * from proceso.documento where ges_id='"+ges_id+"' or (ges_id>7 and ges_id<19) and codigo_barra = '"+cod_barra+"';", function(err, data) {
                            if (err){ reject(err); callback(err); }
                            else{
                                if(data.length > 0)
                                    arrayError.push({codigo_barra:cod_barra, observacion:"EL documento está gestionado"})
                                else
                                    cod_barras_funcion.push(cod_barra);
                                callback();
                            }
                        }); 
                    }
                }
            });
        }, function(err){
            if(!err){
                if(cod_barras_funcion.length > 0){
                    async.each(cod_barras_funcion, function(cod_barra, callback){						
                        ds.connector.execute("select * from proceso.spu_actualizar_gestion_cb("+usu_id+",'"+fecha_entrega+"',"+ges_id+",'"+cod_barra+"');", function(err, data) {
                            if (err) {
                                callback(err);
                            } else {
                                callback();
                            }
                        });
                    }, function(err){
                        console.log("err:", err);
                    })
                }
                next(null,arrayError);
            }else{
                console.log(err);
                next(err);
            }
        });
    };*/
    Gestion.actualizargestionFile = (file,options, next) => {//Cambio de gestion cliente
        var ds = Gestion.dataSource;
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const usu_id = valores && valores.userId;

        let desFileName = ''; 
        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {//spu_actualizar_gestion_archivo antes
                let filename = file.name;
                desFileName = uuid.v1()+"_"+filename;
		      	let destPath = path.join(Gestion.app.get("path").gestion.cambio_gestion, desFileName);             
				fs.copyFile(file.path, destPath, (err) => {
					if (err) {
						reject(err);
					}else{
						let sql = "";console.log("usu_id:",usu_id,"desFileName:",desFileName);
                        sql = "select * from proceso.spu_cambio_gestion_mas($1,$2)";
                        ds.connector.execute(sql, [usu_id,desFileName], function(err, data) {
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
            console.log(err); next("Ocurrio un error al cambiar la gestión.");   
        });
    };
    Gestion.descargaValidar = (cod_barra,ges_id,men_id,options, next) => {
        var ds = Gestion.dataSource;
        const valores = options && options.accessToken;
        const usu_id = valores && valores.userId;

        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select * from proceso.spu_validar_descargar_codigo_barra($1,$2,$3,$4);";
                ds.connector.execute(sql, [cod_barra,ges_id,men_id,usu_id], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });   
            })
        })
        .catch(function(err){
            console.log(err); next("Ocurrio un error al validar los documentos.");   
        });
    };

    Gestion.descargaValidarMultiple = (cod_barra,ges_id,men_id,fecha_ent,options, next) => {
        var ds = Gestion.dataSource;
        const valores = options && options.accessToken;
        const usu_id = valores && valores.userId;

        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select * from proceso.spu_validar_descargar_codigo_barra_multiple($1,$2,$3,$4,$5);";
                ds.connector.execute(sql, [cod_barra,ges_id,men_id,usu_id,fecha_ent], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });   
            })
        })
        .catch(function(err){
            console.log(err); next("Ocurrio un error al validar los documentos.");   
        });
    };

    Gestion.remoteMethod('descargardocumentos', {
        accepts: [
            {arg: "datosDescarga", type: "string", required: true },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
            arg: 'response',
            type: 'object',
            root: true
        },
        http: {
            verb: 'POST',
            path: '/descargardocumentos'
        }
    });
    // Gestion.remoteMethod('descargardocumentos', {
    //     accepts: [        
    //         {arg: "fecha_entrega", type: "string", required: true },
    //         {arg: "ges_id", type: "number", required: true },
    //         {arg: "cod_barra", type: "string", required: true },
    //         {arg: "men_id", type: "number", required: true },
    //         {arg: "fecha_entrega_cargo", type: "string", required: true },
    //         {arg: "options", type: "object", 'http': "optionsFromRequest"}
    //     ],
    //     returns: {
    //         arg: 'response',
    //         type: 'object',
    //         root: true
    //     },
    //     http: {
    //         verb: 'POST',
    //         path: '/descargardocumentos'
    //     }
    // });
    Gestion.remoteMethod('descargarDocumentosFile', {
        accepts: [        
            {arg: "fecha_entrega", type: "string", required: true },
            {arg: "ges_id", type: "string", required: true },
            {arg: "men_id", type: "string", required: true },
            {arg: "fecha_entrega_cargo", type: "string", required: true },
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
            path: '/descargarDocumentosFile'
        }
    });
    Gestion.remoteMethod('descargarMasivoDocumentosFile', {
        accepts: [
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
            path: '/descargarMasivoDocumentosFile'
        }
    });
    Gestion.remoteMethod('actualizargestion', {
        accepts: [        
            {arg: "fecha_entrega", type: "string", required: true },
            {arg: "ges_id", type: "number", required: true },
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
            path: '/actualizargestion'
        }
    });
    Gestion.remoteMethod('actualizargestionFile', {
        accepts: [
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
            path: '/actualizargestionFile'
        }
    });
    Gestion.remoteMethod('descargaValidar', {
        accepts: [
            {arg: "cod_barra", type: "string", required: true },
            {arg: "ges_id", type: "number", required: true },
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
            path: '/descargaValidar'
        }
    });
    Gestion.remoteMethod('descargaValidarMultiple', {
        accepts: [
            {arg: "cod_barra", type: "string", required: true },
            {arg: "ges_id", type: "number", required: true },
            {arg: "men_id", type: "number", required: true },
            {arg: "fecha_ent", type: "string", required: true },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
            arg: 'response',
            type: 'object',
            root: true
        },
        http: {
            verb: 'GET',
            path: '/descargaValidarMultiple'
        }
    });
};