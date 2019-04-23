var { exec } = require('child_process');

module.exports = (GuiaDespacho) => {
    /*Implementación*/
    GuiaDespacho.exportarListaGuias = (fecha_desde,fecha_hasta,gde_id,emp_id_operador,suc_id,tra_id,options, next) => {
        var ds = GuiaDespacho.dataSource;
        let valores = options && options.accessToken;
		let token = valores && valores.id;
        let userId = valores && valores.userId;
        let extension = 'XLSX';
        let tipo = '14';
        let ordenado_por='gud_id desc',
        desde_fila='-1',
        limite_filas='100000',
        descripcion='Guias despacho';

        if(extension != 'PDF' && extension != 'XLSX'){
            next(null,{error:true,mensaje:'Extension es erroneo'});
        }else{
            if(!gde_id)gde_id=0;
            if(!suc_id)suc_id=0;            
            GuiaDespacho.app.models.user.findById(
               userId,{},
               (err,data)=>{
                   if(err)next(err);
                   else{
                       if(!data){
                           next("Usuario no tiene acceso");
                       }else{						
                           //let cmd = 'python3 '+GuiaDespacho.app.get("python").reporte.run_reporte_birt+' '+tipo+" '"+extension+"' "+'\'-p "p_desde='+fecha_desde+'" -p "p_hasta='+fecha_hasta+'" -p "p_gde_id='+gde_id+'" -p "p_emp_id_operador='+emp_id_operador+'" -p "p_suc_despacho_id='+suc_id+'" -p "p_tra_id='+tra_id+'" -p "p_ordenado_por='+ordenado_por+'" -p "p_desde_fila='+desde_fila+'" -p "p_limite_filas='+limite_filas+'" -p "p_usu_id='+userId+'"\' '+userId+' \''+descripcion+'\'';

                           let cmd = 'python3 '+GuiaDespacho.app.get("python").reporte.run_reporte_excel+' '+tipo+' '+userId+' '+fecha_desde+' '+fecha_hasta+' '+gde_id+' '+emp_id_operador+' '+suc_id+' '+tra_id+" '"+ordenado_por+"' "+desde_fila+' '+limite_filas+' '+userId;
                           console.log(cmd); 
                           exec(cmd, (err, stdout, stderr) => {
                               if (err) {console.log("error:",err);
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
    GuiaDespacho.exportarListaGuiasDetalle = (fecha_desde,fecha_hasta,gde_id,emp_id_operador,suc_id,tra_id,options, next) => {
        var ds = GuiaDespacho.dataSource;
        let valores = options && options.accessToken;
		let token = valores && valores.id;
        let userId = valores && valores.userId;
         
        let extension = 'XLSX';
        let tipo = '15';
        let sucursal='',     
        descripcion='Detalle de Documentos por guía entre '+fecha_desde+' y '+fecha_hasta;

        GuiaDespacho.app.models.user.findById(userId,{},
            (err,data) => {
                if(err){         
                    next(null,{error:true,mensaje:'Ocurrio un error al recuperar la sucursal asignada'});
                }else{
                    if(!data){ reject("No se encontro la sucursal asignbada a ud."); } 
                    else { sucursal = data.suc_id; }
                }
            }
        );

        if(extension != 'PDF' && extension != 'XLSX'){
            next(null,{error:true,mensaje:'Extension es erroneo'});
        }else{
            //let cmd = 'python3 '+GuiaDespacho.app.get("python").reporte.run_reporte_birt+' '+tipo+" '"+extension+"' "+'\'-p "p_desde='+fecha_desde+'" -p "p_hasta='+fecha_hasta+'" -p "p_gde_id='+gde_id+'" -p "p_emp_id_operador='+emp_id_operador+'" -p "p_suc_despacho_id='+suc_id+'" -p "p_tra_id='+tra_id+'" -p "p_usu_id='+userId+'"\' '+userId+' \''+descripcion+'\'';
            if(!gde_id)gde_id=0;
            if(!suc_id)suc_id=0;
            console.log("estado:",gde_id);
            GuiaDespacho.app.models.user.findById(
               userId,{},
               (err,data)=>{
                   if(err)next(err);
                   else{
                       if(!data){
                           next("Usuario no tiene acceso");
                       }else{						
                        //let cmd = 'python3 '+GuiaDespacho.app.get("python").reporte.run_reporte_birt+' '+tipo+" '"+extension+"' "+'\'-p "p_desde='+fecha_desde+'" -p "p_hasta='+fecha_hasta+'" -p "p_gde_id='+gde_id+'" -p "p_emp_id_operador='+emp_id_operador+'" -p "p_suc_despacho_id='+suc_id+'" -p "p_tra_id='+tra_id+'" -p "p_usu_id='+userId+'"\' '+userId+' \''+descripcion+'\'';
                        let cmd = 'python3 '+GuiaDespacho.app.get("python").reporte.run_reporte_excel+' '+tipo+" "+userId+" "+fecha_desde+" "+fecha_hasta+" "+gde_id+" "+emp_id_operador+" "+suc_id+" "+tra_id+" "+userId;
                        console.log(cmd); 
                            exec(cmd, (err, stdout, stderr) => {
                               if (err) {console.log("error: ",err)
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
    GuiaDespacho.ImpimirGuiaDetalle = (gud_id,suc_id,options, next) => {
        var ds = GuiaDespacho.dataSource;
        let valores = options && options.accessToken;
		let token = valores && valores.id;
        let userId = valores && valores.userId;
        let extension = 'PDF';
        let tipo = '16'; 
        let descripcion='Guia de despacho '+gud_id;

        if(extension != 'PDF' && extension != 'XLSX'){
            next(null,{error:true,mensaje:'Extension es erroneo'});
        }else{                          
            GuiaDespacho.app.models.user.findById(
               userId,{},
               (err,data)=>{
                   if(err)next(err);
                   else{
                       if(!data){
                           next("Usuario no tiene acceso");
                       }else{						
                            let cmd = 'python3 '+GuiaDespacho.app.get("python").reporte.run_reporte_birt+' '+tipo+" '"+extension+"' "+'\'-p "guia='+gud_id+'" -p "usuario='+userId+'"\' '+userId+' \''+descripcion+'\'';
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
    GuiaDespacho.exportarListaGuiasRecep = (fecha_desde,fecha_hasta,gde_id,emp_id_operador,suc_id,tra_id,options, next) => {
        var ds = GuiaDespacho.dataSource;
        let valores = options && options.accessToken;
		let token = valores && valores.id;
        let userId = valores && valores.userId;
        let extension = 'XLSX';
        let tipo = '17';
        let ordenado_por='gud_id desc',
        desde_fila='-1',
        limite_filas='100000',
        descripcion='Guias por recibir';
        if(extension != 'PDF' && extension != 'XLSX'){
            next(null,{error:true,mensaje:'Extension es erroneo'});
        }else{
            if(!gde_id)gde_id=0;
            if(!suc_id)suc_id=0;             
            GuiaDespacho.app.models.user.findById(
               userId,{},
               (err,data)=>{
                   if(err)next(err);
                   else{
                       if(!data){
                           next("Usuario no tiene acceso");
                       }else{						
                           //let cmd = 'python3 '+GuiaDespacho.app.get("python").reporte.run_reporte_birt+' '+tipo+" '"+extension+"' "+'\'-p "p_desde='+fecha_desde+'" -p "p_hasta='+fecha_hasta+'" -p "p_gde_id='+gde_id+'" -p "p_emp_id_operador='+emp_id_operador+'" -p "p_suc_remitente_id='+suc_id+'" -p "p_tra_id='+tra_id+'" -p "p_ordenado_por='+ordenado_por+'" -p "p_desde_fila='+desde_fila+'" -p "p_limite_filas='+limite_filas+'" -p "p_usu_id='+userId+'"\' '+userId+' \''+descripcion+'\'';
                           let cmd = 'python3 '+GuiaDespacho.app.get("python").reporte.run_reporte_excel+' '+tipo+' '+userId+" '"+fecha_desde+"' '"+fecha_hasta+"' "+gde_id+' '+emp_id_operador+' '+suc_id+' '+tra_id+" '"+ordenado_por+"' "+desde_fila+' '+limite_filas+' '+userId;
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
    GuiaDespacho.exportarListaGuiasDetalleRecep = (fecha_desde,fecha_hasta,gde_id,emp_id_operador,suc_id,tra_id,options, next) => {
        var ds = GuiaDespacho.dataSource;
        let valores = options && options.accessToken;
		let token = valores && valores.id;
        let userId = valores && valores.userId;
         
        let extension = 'XLSX';
        let tipo = '18';
        let sucursal='';
        let ordenado_por='gud_id desc',
        desde_fila='-1',
        limite_filas='100000',   
        descripcion='Base de documentos por recibir';

        GuiaDespacho.app.models.user.findById(userId,{},
            (err,data) => {
                if(err){         
                    next(null,{error:true,mensaje:'Ocurrio un error al recuperar la sucursal asignada'});
                }else{
                    if(!data){ reject("No se encontro la sucursal asignbada a ud."); } 
                    else { sucursal = data.suc_id; }
                }
            }
        );
        if(extension != 'PDF' && extension != 'XLSX'){
            next(null,{error:true,mensaje:'Extension es erroneo'});
        }else{
            if(!gde_id)gde_id=0;
            if(!suc_id)suc_id=0;             
            GuiaDespacho.app.models.user.findById(
               userId,{},
               (err,data)=>{
                   if(err)next(err);
                   else{
                       if(!data){
                           next("Usuario no tiene acceso");
                       }else{						
                        //let cmd = 'python3 '+GuiaDespacho.app.get("python").reporte.run_reporte_birt+' '+tipo+" '"+extension+"' "+'\'-p "p_desde='+fecha_desde+'" -p "p_hasta='+fecha_hasta+'" -p "p_gde_id='+gde_id+'" -p "p_emp_id_operador='+emp_id_operador+'" -p "p_suc_remitente_id='+suc_id+'" -p "p_tra_id='+tra_id+'" -p "p_ordenado_por='+ordenado_por+'" -p "p_desde_fila='+desde_fila+'" -p "p_limite_filas='+limite_filas+'" -p "p_usu_id='+userId+'"\' '+userId+' \''+descripcion+'\'';
                            let cmd = 'python3 '+GuiaDespacho.app.get("python").reporte.run_reporte_excel+' '+tipo+' '+userId+" '"+fecha_desde+"' '"+fecha_hasta+"' "+gde_id+' '+emp_id_operador+' '+suc_id+' '+tra_id+' '+userId;
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
    GuiaDespacho.DescargarExcelGuia = (gui_id,options, next) => {
        let valores = options && options.accessToken;
        let userId = valores && valores.userId;
         
        let extension = 'XLSX';
        let tipo = '22'; 
        let descripcion='Reporte detalle de despacho';

        if(extension != 'PDF' && extension != 'XLSX'){
            next(null,{error:true,mensaje:'Extension es erroneo'});
        }else{
                          
            GuiaDespacho.app.models.user.findById(
               userId,{},
               (err,data)=>{
                   if(err)next(err);
                   else{
                       if(!data){
                           next("Usuario no tiene acceso");
                       }else{						
                        //let cmd = 'python3 '+GuiaDespacho.app.get("python").reporte.run_reporte_birt+' '+tipo+" '"+extension+"' "+'\'-p "p_guia='+gui_id+'" -p "p_usuario='+userId+'"\' '+userId+' \''+descripcion+'\'';
                            let cmd = 'python3 '+GuiaDespacho.app.get("python").reporte.run_reporte_excel+' '+tipo+' '+userId+' '+gui_id+' '+userId;
                            console.log(cmd); 
                            exec(cmd, (err, stdout, stderr) => {
                               if (err) {console.log("error: ",err);
                                   next(null, { error: true, mensaje: err });
                               }else{
                                   next(null, { error: false, archivo: stdout });
                               }
                           });                           
                       }
                   }
               }
            );
        } 
    };
    /*Definición*/
    GuiaDespacho.remoteMethod('exportarListaGuias', {
        accepts: [
          {arg: "fecha_desde", type: "string", required: true },        
          {arg: "fecha_hasta", type: "string", required: true },
          {arg: "gde_id", type: "number", required: false },
          {arg: "emp_id_operador", type: "number", required: false },        
          {arg: "suc_id", type: "number", required: false },
          {arg: "tra_id", type: "number", required: false },
          {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: { arg: 'response', type: 'object', root: true },
        http: { verb: 'GET', path: '/exportarListaGuias' }
    });
    GuiaDespacho.remoteMethod('exportarListaGuiasDetalle', {
        accepts: [
          {arg: "fecha_desde", type: "string", required: true },        
          {arg: "fecha_hasta", type: "string", required: true },
          {arg: "gde_id", type: "number", required: false },
          {arg: "emp_id_operador", type: "number", required: false },
          {arg: "suc_id", type: "number", required: false },      
          {arg: "tra_id", type: "number", required: false },          
          {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: { arg: 'response', type: 'object', root: true },
        http: { verb: 'GET', path: '/exportarListaGuiasDetalle' }
    });
    GuiaDespacho.remoteMethod('ImpimirGuiaDetalle', {
        accepts: [
            {arg: "gud_id", type: "string", required: true },        
            {arg: "suc_id", type: "number", required: false },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: { arg: 'response', type: 'object', root: true },
        http: { verb: 'GET', path: '/ImpimirGuiaDetalle' }
    });
    GuiaDespacho.remoteMethod('exportarListaGuiasRecep', {
        accepts: [
          {arg: "fecha_desde", type: "string", required: true },        
          {arg: "fecha_hasta", type: "string", required: true },
          {arg: "gde_id", type: "number", required: false },
          {arg: "emp_id_operador", type: "number", required: false },        
          {arg: "suc_id", type: "number", required: false },
          {arg: "tra_id", type: "number", required: false },
          {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: { arg: 'response', type: 'object', root: true },
        http: { verb: 'GET', path: '/exportarListaGuiasRecep' }
    });
    GuiaDespacho.remoteMethod('exportarListaGuiasDetalleRecep', {
        accepts: [
          {arg: "fecha_desde", type: "string", required: true },        
          {arg: "fecha_hasta", type: "string", required: true },
          {arg: "gde_id", type: "number", required: false },
          {arg: "emp_id_operador", type: "number", required: false },
          {arg: "suc_id", type: "number", required: false },      
          {arg: "tra_id", type: "number", required: false },          
          {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: { arg: 'response', type: 'object', root: true },
        http: { verb: 'GET', path: '/exportarListaGuiasDetalleRecep' }
    });
    GuiaDespacho.remoteMethod('DescargarExcelGuia', {
        accepts: [
            {arg: "gui_id", type: "string", required: true },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: { arg: 'response', type: 'object', root: true },
        http: { verb: 'GET', path: '/DescargarExcelGuia' }
    });
}