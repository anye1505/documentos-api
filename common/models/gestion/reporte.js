let fs = require('fs');
let uuid = require('uuid');
let path = require('path');
const async = require('async');
let Hooks = require('../../../helpers/hooks');
let Files = require('../../../helpers/files');
const { promisify } = require('util');
const moment 	= require('moment');
var { exec } = require('child_process');

module.exports = (Gestion) => {

    Gestion.reportemensajerocontrol = (fecha_ini, fecha_fin, mensajero, emp_id_courier, suc_id, emp_id_operador, cli_id, prd_id,emp_id_operador_dist,options, next) => {
        var ds = Gestion.dataSource;
     
        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "SELECT * from gestion.spu_reporte_mensajero_control($1,$2,$3,$4,$5,$6,$7,$8, $9);";
                var data = [fecha_ini, fecha_fin, emp_id_operador, cli_id, prd_id, emp_id_courier, suc_id, mensajero, parseInt(emp_id_operador_dist)]
                ds.connector.execute(sql,data, function(err, data) {
                    if (err){ reject(err); }
                    else{
                        next(null,data); 
                    }
                });               
            });
        })
        .catch(function(err){
            console.log(err);
        });
    };

    Gestion.reportemensajero = (fecha_ini, fecha_fin, mensajero, emp_id_courier, suc_id, emp_id_operador, cli_id, prd_id,emp_id_operador_dist,options, next) => {
        var ds = Gestion.dataSource;
     
        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "SELECT * from gestion.spu_reporte_mensajero($1,$2,$3,$4,$5,$6,$7,$8, $9);";
                var data = [fecha_ini, fecha_fin, mensajero, emp_id_courier, suc_id, emp_id_operador, cli_id, prd_id, parseInt(emp_id_operador_dist)]
                ds.connector.execute(sql,data, function(err, data) {
                    if (err){ reject(err); }
                    else{ 
                        let dataid = [];
                        let ids = [];
                        for(let i in data){
                            if(ids.indexOf(data[i].men_id) < 0){
                                ids.push(data[i].men_id);
                                dataid.push(
                                    {
                                        men_id: data[i].men_id,
                                        men_nombre: data[i].men_nombre,
                                        documentos_entregados_al_mensajero: data[i].documentos_entregados_al_mensajero,
                                        documentos_cerrados_por_el_mensajero: data[i].documentos_cerrados_por_el_mensajero,
                                        documentos_por_cerrar: data[i].documentos_por_cerrar,
                                        documentos_imagen: data[i].documentos_imagen,
                                        detalle:[
                                            {
                                                gui_fecha_entrega: data[i].gui_fecha_entrega,
                                                documentos_entregados_al_mensajero: data[i].documentos_entregados_al_mensajero,
                                                documentos_cerrados_por_el_mensajero: data[i].documentos_cerrados_por_el_mensajero,
                                                documentos_por_cerrar: data[i].documentos_por_cerrar,
                                                documentos_imagen: data[i].documentos_imagen
                                            }
                                        ]
                                    }
                                )
                            }else{
                                for(let j in dataid){
                                    if(data[i].men_id == dataid[j].men_id){
                                        dataid[j].documentos_entregados_al_mensajero =  data[j].documentos_entregados_al_mensajero + data[i].documentos_entregados_al_mensajero;
                                        dataid[j].documentos_cerrados_por_el_mensajero =  data[j].documentos_cerrados_por_el_mensajero + data[i].documentos_cerrados_por_el_mensajero;
                                        dataid[j].documentos_por_cerrar =  data[j].documentos_por_cerrar + data[i].documentos_por_cerrar;
                                        dataid[j].documentos_imagen =  data[j].documentos_imagen + data[i].documentos_imagen;
                                        for(let k in dataid[j].detalle){
                                            if(dataid[j].detalle[k].gui_fecha_entrega == data[i].gui_fecha_entrega){
                                                dataid[j].detalle[k].documentos_entregados_al_mensajero = dataid[j].detalle[k].documentos_entregados_al_mensajero + data[i].documentos_entregados_al_mensajero;
                                                dataid[j].detalle[k].documentos_cerrados_por_el_mensajero = dataid[j].detalle[k].documentos_cerrados_por_el_mensajero + data[i].documentos_cerrados_por_el_mensajero;
                                                dataid[j].detalle[k].documentos_por_cerrar = dataid[j].detalle[k].documentos_por_cerrar + data[i].documentos_por_cerrar;
                                                dataid[j].detalle[k].documentos_imagen = dataid[j].detalle[k].documentos_imagen + data[i].documentos_imagen;
                                            }else{
                                                dataid[j].detalle.push(
                                                    {
                                                        gui_fecha_entrega: data[i].gui_fecha_entrega,
                                                        documentos_entregados_al_mensajero: data[i].documentos_entregados_al_mensajero,
                                                        documentos_cerrados_por_el_mensajero: data[i].documentos_cerrados_por_el_mensajero,
                                                        documentos_por_cerrar: data[i].documentos_por_cerrar,
                                                        documentos_imagen: data[i].documentos_imagen
                                                    }
                                                )
                                            }
                                        }
                                    }
                                }
                            }

                        }
                        next(null,dataid); 
                    }
                });   
            })
        })
        .catch(function(err){
            console.log(err);   
        });
    };

    Gestion.exportarexcel = (order_ids,options, next) => {
        var ds = Gestion.dataSource;
      let valores = options && options.accessToken;
      let userId = valores && valores.userId;

      let extension = 'XLSX';
      let tipo = '19';
      descripcion='Reporte para cierre OS';

      if(extension != 'PDF' && extension != 'XLSX'){
          next(null,{error:true,mensaje:'Extension es erroneo'});
      }else{        
          let cmd = 'python3 '+Gestion.app.get("python").reporte.run_reporte_birt+' '+tipo+" '"+extension+"' "+'\'-p "ordenes='+order_ids+'"\' '+userId+' \''+descripcion+'\'';
          console.log(cmd);               
          Gestion.app.models.user.findById(
             userId,{},
             (err,data)=>{
                 if(err)next(err);
                 else{
                     if(!data){
                         next("Usuario no tiene acceso");
                     }else{	
                    					
                      let cmd = 'python3 '+Gestion.app.get("python").reporte.run_reporte_birt+' '+tipo+" '"+extension+"' "+'\'-p "ordenes='+order_ids+'"\' '+userId+' \''+descripcion+'\'';
                         exec(cmd, (err, stdout, stderr) => {
                             if (err) {
                                 next(null, { error: true, mensaje: err });
                             }else{
                                 //console.log("ejecuto bien el comando");
                                 next(null, { error: false, archivo: stdout });
                             }
                         });                           
                     }
                 }
             }
          );
      } 
    };

    Gestion.reportetxt = (courier_id, order_ids, tipo, suc_id, options, next) => {
        var ds = Gestion.dataSource;
        let valores = options && options.accessToken;console.log("valores:",valores);
        let userId = valores && valores.userId;
        var mkdirp = require('mkdirp');
        Promise.resolve()
        .then(()=> {
        return new Promise(function(resolve, reject) {
        Gestion.app.models.user.findById(
            userId,{},
            (err,data)=>{
              if(err){            
                reject(err);
              }else{
                if(!data){
                  reject("");
                }else{      
                  resolve(data.emp_id);
                }
              }
            }
          )
        })
        })
        .then((courier_id)=>{console.log("courier_id:",courier_id,"order_ids:",order_ids, "tipo_txt:",tipo);
                var sql = "select * from proceso.spu_result_carpeta_enotria($1,$2);";
                var data = [courier_id, order_ids];
                //const mkdirSync = promisify(fs.mkdirSync);
                const mkdirSync = promisify(mkdirp);
                const execSync = promisify(exec);
                ds.connector.execute(sql,data, async (err, data) => {
                    if (err){ reject(err); }
                    else{ console.log("data:",data);
                        for(let i in data){
                            let destPath = "/mnt/nfs/resultado_enotria/"+courier_id+"/"+data[i].carpeta;
                            console.log("destPath:",destPath);
                            try {
                                await mkdirSync(destPath);
                                
                            } catch (err) {
                                    throw err
                            }
                        }
                        
                        var sql = "select * from proceso.spu_result_txt_enotria_sucursal($1,$2,$3,$4);";
                        var data = [courier_id, order_ids, tipo || 1, suc_id];console.log("data:",data);
                        ds.connector.execute(sql,data, async(err, data)=> {
                            if (err){ reject(err); }
                            else{
                                let zip = new require('node-zip')();
                                for(let i in data){

                                    console.log(data[i].archivo);
                                    let buff = fs.readFileSync(data[i].archivo);
                                    console.log( buff.toString().length );
                                    if(buff.toString().length > 0){
                                        let cmd1 = "unix2dos "+data[i].archivo;
                                        let cmd2 = "truncate -s-2 "+data[i].archivo;
                                        try {
                                            await execSync(cmd1);
                                            await execSync(cmd2);
                                        } catch (err) {
                                                throw err
                                        }
    
                                        zip.file(data[i].nombre, fs.readFileSync(data[i].archivo));
                                    }

                                }
                                const dataZip = zip.generate({ base64:false, compression: 'DEFLATE' });
                                const url = '/public/' + moment().format('YYYYMMDDHHmmss') + '.zip';
                                try{
                                    fs.writeFileSync('.'+url, dataZip, 'binary');
                                    next(null,{url:url,mensaje:"Generando reporte"});
                                }catch(err){
                                    console.log(err); 
                                }

                            }
                        });
                    }
                });   
            })
        .catch(function(err){
            console.log(err);   
        });
    };

    Gestion.reporteclienteproceso = (fecha_ini, fecha_fin, emp_id_courier, cli_id, prd_id, emp_id_operador, tre_id,options, next) => {
        var ds = Gestion.dataSource;
        let valores = options && options.accessToken;
        let userId = valores && valores.userId;
        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "SELECT * from gestion.spu_reporte_cliente_proceso($1,$2,$3,$4,$5,$6,$7);";
                var data = [fecha_ini, fecha_fin, emp_id_courier, cli_id, prd_id, emp_id_operador, tre_id]
                ds.connector.execute(sql,data, function(err, data) {
                    if (err){ reject(err); }
                    else{
                        next(null,data); 
                    }
                });               
            });
        })
        .catch(function(err){
            console.log(err);
        });
    };

    Gestion.reportemensajeropendiente = (gui_id,emp_id_courier,options, next) => {
        var ds = Gestion.dataSource;
     
        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "SELECT * from gestion.spu_reporte_mensajero_pendiente($1,$2);";
                var data = [gui_id,emp_id_courier]
                ds.connector.execute(sql,data, function(err, data) {
                    if (err){ reject(err); }
                    else{
                        next(null,data); 
                    }
                });               
            });
        })
        .catch(function(err){
            console.log(err);
        });
    };

    Gestion.reporteagentependiente = (guidespacho_id,emp_id_courier,options, next) => {
        var ds = Gestion.dataSource;
     
        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "SELECT * from gestion.spu_reporte_agente_pendiente($1,$2);";
                var data = [guidespacho_id,emp_id_courier]
                ds.connector.execute(sql,data, function(err, data) {
                    if (err){ reject(err); }
                    else{
                        next(null,data); 
                    }
                });               
            });
        })
        .catch(function(err){
            console.log(err);
        });
    };

    Gestion.reporteagentecontrol = (fecha_ini, fecha_fin, emp_id_courier, suc_id, emp_id_operador, cli_id, prd_id,emp_id_operador_dist,options, next) => {
        var ds = Gestion.dataSource;
     
        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select * from gestion.spu_reporte_agente_control($1,$2,$3,$4,$5,$6,$7,$8);";
                var data = [fecha_ini, fecha_fin, emp_id_operador, cli_id, prd_id, emp_id_courier, suc_id, parseInt(emp_id_operador_dist)]
                ds.connector.execute(sql,data, function(err, data) {
                    if (err){ reject(err); }
                    else{
                        next(null,data); 
                    }
                });               
            });
        })
        .catch(function(err){
            console.log(err);
        });
    };

    Gestion.exportarexcelmensajero = (fecha_ini, fecha_fin, mensajero, emp_id_courier, suc_id, emp_id_operador, cli_id, prd_id,emp_id_operador_dist,options, next) => {
        var ds = Gestion.dataSource;
      let valores = options && options.accessToken;
      let userId = valores && valores.userId;

      let extension = 'XLSX';
      let tipo = '23';
      descripcion='Reporte control mensajero';

      if(extension != 'PDF' && extension != 'XLSX'){
          next(null,{error:true,mensaje:'Extension es erroneo'});
      }else{
        
                         
          Gestion.app.models.user.findById(
             userId,{},
             (err,data)=>{
                 if(err)next(err);
                 else{
                     if(!data){
                         next("Usuario no tiene acceso");
                     }else{						
                        
                        //let cmd = 'python3 '+Gestion.app.get("python").reporte.run_reporte_birt+' '+tipo+" '"+extension+"' "+'\'-p "p_fecha_desde='+fecha_ini+'" -p "p_fecha_hasta='+fecha_fin+'" -p "p_emp_id_operador='+emp_id_operador+'" -p "p_cli_id='+cli_id+'" -p "p_prd_id='+prd_id+'" -p "p_emp_id_courier='+emp_id_courier+'" -p "p_suc_id='+suc_id+'" -p "p_mensajero='+mensajero+'" -p "p_emp_id_operador_dist='+emp_id_operador_dist+'"\' '+userId+' \''+descripcion+'\'';
                        let cmd = 'python3 '+Gestion.app.get("python").reporte.run_reporte_excel+' '+tipo+' '+userId+" '"+fecha_ini+"' '"+fecha_fin+"' "+emp_id_operador+' '+cli_id+" '"+prd_id+"' "+emp_id_courier+' '+suc_id+" '"+mensajero+"' "+emp_id_operador_dist;
                        console.log(cmd);
                        exec(cmd, (err, stdout, stderr) => {
                             if (err) {console.log("error: ",err);
                                 next(null, { error: true, mensaje: err });
                             }else{
                                 //console.log("ejecuto bien el comando");
                                 next(null, { error: false, archivo: stdout });
                             }
                        });                           
                     }
                 }
             }
          );
      } 
    };

    Gestion.exportarexcelmensajerodetallado = (fecha_ini, fecha_fin, mensajero, emp_id_courier, suc_id, emp_id_operador, cli_id,prd_id,emp_id_operador_dist,options,next) => {
      let valores = options && options.accessToken;
      let userId = valores && valores.userId;
      let tipo = '24';
               
          Gestion.app.models.user.findById(
             userId,{},
             (err,data)=>{
                 if(err){next(err)}
                 else{
                     if(!data){
                         next("Usuario no tiene acceso");
                     }else{
                        let cmd = 'python3 '+Gestion.app.get("python").reporte.run_reporte_excel+' '+tipo+' '+userId+" '"+fecha_ini+"' '"+fecha_fin+"' "+emp_id_operador+' '+cli_id+" '"+prd_id+"' "+emp_id_courier+' '+suc_id+" '"+mensajero+"' "+emp_id_operador_dist;
                        console.log(cmd);
                        exec(cmd, (err, stdout, stderr) => {
                             if (err) {console.log("error: ",err);
                                 next(null, { error: true, mensaje: err });
                             }else{
                                 //console.log("ejecuto bien el comando");
                                 next(null, { error: false, archivo: stdout });
                             }
                        });                           
                     }
                 }
             }
          );
    };

    Gestion.reportetxt1 = (order_ids, tipo_txt, options, next) => {
        var ds = Gestion.dataSource;
        let valores = options && options.accessToken;
        let userId = valores && valores.userId;
        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                /*var sql = "select * from proceso.spu_result_carpeta_enotria($1,$2);";
                var data = [courier_id, order_ids];
                const mkdirSync = promisify(fs.mkdirSync);
                ds.connector.execute(sql,data, async (err, data) => {
                    if (err){ reject(err); }
                    else{ 
                        for(let i in data){
                            let destPath = "/mnt/nfs/resultado_enotria/"+courier_id+"/"+data[i].carpeta;
                            try {
                                await mkdirSync(destPath)
                            } catch (err) {
                                if (err.code !== 'EEXIST') throw err
                            }
                        }*/
                        var sql = "select * from proceso.spu_result_txt_tipo($1,$2,$3);";
                        var data = [order_ids, tipo_txt, userId];
                        ds.connector.execute(sql,data, function(err, data) {
                            if (err){ reject(err); }
                            else{
                                let zip = new require('node-zip')();
                                for(let i in data){
                                    let nombre = data[i].spu_result_txt_tipo.substring(16, 100);console.log("nombre=",nombre);
                                    zip.file(nombre, fs.readFileSync(data[i].spu_result_txt_tipo));
                                }
                                const dataZip = zip.generate({ base64:false, compression: 'DEFLATE' });
                                const url = '/public/' + moment().format('YYYYMMDDHHmmss') + '.zip';console.log("URL=",url);
                                try{
                                    fs.writeFileSync('.'+url, dataZip, 'binary');
                                    next(null,{url:url,mensaje:"Generando reporte"});
                                }catch(err){
                                    console.log(err); 
                                }

                            }
                        });
                    /*}
                }); */  
            })
        })
        .catch(function(err){
            console.log(err);   
        });
    };

    
    Gestion.remoteMethod('reportemensajerocontrol', {
        accepts: [        
            {arg: "fecha_ini", type: "string", required: true },
            {arg: "fecha_fin", type: "string", required: true },  
            {arg: 'mensajero', type: 'string', required: false},
            {arg: 'emp_id_courier', type: 'number', required: true},
            {arg: 'suc_id', type: 'number', required: true},
            {arg: 'emp_id_operador', type: 'number', required: true},
            {arg: 'cli_id', type: 'number', required: true},
            {arg: 'prd_id', type: 'string', required: false},
            {arg: 'emp_id_operador_dist', type: 'number', required: true},
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
        arg: 'response',
        type: 'object',
        root: true
        },
        http: {
        verb: 'POST',
        path: '/reporte/reporte_mensajero_control'
        }
    });
  
    Gestion.remoteMethod('reportemensajero', {
        accepts: [        
            {arg: "fecha_ini", type: "string", required: true },
            {arg: "fecha_fin", type: "string", required: true },  
            {arg: 'mensajero', type: 'number', required: true},
            {arg: 'emp_id_courier', type: 'number', required: true},
            {arg: 'suc_id', type: 'number', required: true},
            {arg: 'emp_id_operador', type: 'number', required: true},
            {arg: 'cli_id', type: 'number', required: true},
            {arg: 'prd_id', type: 'number', required: true},
            {arg: 'emp_id_operador_dist', type: 'number', required: true},
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
        arg: 'response',
        type: 'object',
        root: true
        },
        http: {
        verb: 'POST',
        path: '/reporte/reporte_mensajero'
        }
    });

    Gestion.remoteMethod('exportarexcel', {
        accepts: [        
            {arg: "order_ids", type: "string", required: true },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
        arg: 'response',
        type: 'object',
        root: true
        },
        http: {
        verb: 'POST',
        path: '/reporte/exportar_excel'
        }
    });

    Gestion.remoteMethod('reportetxt', {
        accepts: [        
            {arg: "courier_id", type: "number", required: false },
            {arg: "order_ids", type: "string", required: true },
            {arg: "tipo", type: "number", required: true },
            {arg: "suc_id", type: "number", required: true },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
        arg: 'response',
        type: 'object',
        root: true
        },
        http: {
        verb: 'POST',
        path: '/reporte/exportar_txt'
        }
    });

    Gestion.remoteMethod('reporteclienteproceso', {
        accepts: [        
            {arg: "fecha_ini", type: "string", required: true },
            {arg: "fecha_fin", type: "string", required: true },
            {arg: 'emp_id_courier', type: 'number', required: true},
            {arg: 'cli_id', type: 'number', required: true},
            {arg: 'prd_id', type: 'string', required: false},
            {arg: 'emp_id_operador', type: 'number', required: false},
            {arg: 'tre_id', type: 'number', required: true},
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
        arg: 'response',
        type: 'object',
        root: true
        },
        http: {
        verb: 'POST',
        path: '/reporte/reporte_cliente_proceso'
        }
    });

    Gestion.remoteMethod('reportemensajeropendiente', {
        accepts: [        
            {arg: "gui_id", type: "number", required: true },
            {arg: "emp_id_courier", type: "number", required: true },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
        arg: 'response',
        type: 'object',
        root: true
        },
        http: {
        verb: 'POST',
        path: '/reporte/reporte_mensajero_pendiente'
        }
    });

    Gestion.remoteMethod('reporteagentependiente', {
        accepts: [        
            {arg: "guidespacho_id", type: "number", required: true },
            {arg: "emp_id_courier", type: "number", required: true },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
        arg: 'response',
        type: 'object',
        root: true
        },
        http: {
        verb: 'POST',
        path: '/reporte/reporte_agente_pendiente'
        }
    });

    Gestion.remoteMethod('reporteagentecontrol', {
        accepts: [        
            {arg: "fecha_ini", type: "string", required: true },
            {arg: "fecha_fin", type: "string", required: true },
            {arg: 'emp_id_courier', type: 'number', required: true},
            {arg: 'suc_id', type: 'number', required: true},
            {arg: 'emp_id_operador', type: 'number', required: true},
            {arg: 'cli_id', type: 'number', required: true},
            {arg: 'prd_id', type: 'string', required: false},
            {arg: 'emp_id_operador_dist', type: 'number', required: true},
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
        arg: 'response',
        type: 'object',
        root: true
        },
        http: {
        verb: 'POST',
        path: '/reporte/reporte_agente_control'
        }
    });

    Gestion.remoteMethod('exportarexcelmensajero', {
        accepts: [        
            {arg: "fecha_ini", type: "string", required: true },
            {arg: "fecha_fin", type: "string", required: true },  
            {arg: 'mensajero', type: 'string', required: false},
            {arg: 'emp_id_courier', type: 'number', required: true},
            {arg: 'suc_id', type: 'number', required: true},
            {arg: 'emp_id_operador', type: 'number', required: true},
            {arg: 'cli_id', type: 'number', required: true},
            {arg: 'prd_id', type: 'string', required: false},
            {arg: 'emp_id_operador_dist', type: 'number', required: true},
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
        arg: 'response',
        type: 'object',
        root: true
        },
        http: {
        verb: 'POST',
        path: '/reporte/exportar_excel_mensajero'
        }
    });

    Gestion.remoteMethod('reportetxt1', {
        accepts: [
            {arg: "order_ids", type: "string", required: true },
            {arg: "tipo_txt", type: "number", required: true },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
        arg: 'response',
        type: 'object',
        root: true
        },
        http: {
        verb: 'POST',
        path: '/reporte/exportar_txt1'
        }
    });

    Gestion.remoteMethod('exportarexcelmensajerodetallado', {
        accepts: [        
            {arg: "fecha_ini", type: "string", required: true },
            {arg: "fecha_fin", type: "string", required: true },  
            {arg: 'mensajero', type: 'string', required: false},
            {arg: 'emp_id_courier', type: 'number', required: true},
            {arg: 'suc_id', type: 'number', required: true},
            {arg: 'emp_id_operador', type: 'number', required: true},
            {arg: 'cli_id', type: 'number', required: true},
            {arg: 'prd_id', type: 'string', required: false},
            {arg: 'emp_id_operador_dist', type: 'number', required: true},
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
        arg: 'response',
        type: 'object',
        root: true
        },
        http: {
        verb: 'POST',
        path: '/reporte/exportar_excel_mensajero_detallado'
        }
    });
};