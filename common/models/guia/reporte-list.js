var { exec } = require('child_process');

module.exports = (Guia) => {
    /*Implementación*/
    Guia.exportarListaGuias = (fecha_desde,fecha_hasta,gue_id,emp_id_operador,men_id,despachador_id,options, next) => {
        var ds = Guia.dataSource;
        let valores = options && options.accessToken;
		let token = valores && valores.id;
        let userId = valores && valores.userId;

        let extension = 'XLSX';
        let tipo = '11';
        let ordenado_por='gui_id desc',
        desde_fila='-1',
        limite_filas='100000',
        descripcion='Reporte de guías';

        if(extension != 'PDF' && extension != 'XLSX'){
            next(null,{error:true,mensaje:'Extension es erroneo'});
        }else{               
            Guia.app.models.user.findById(
               userId,{},
               (err,data)=>{
                   if(err)next(err);
                   else{
                       if(!data){
                           next("Usuario no tiene acceso");
                       }else{	//descarga bien con el nuevo python	
                        let cmd = 'python3 '+Guia.app.get("python").reporte.run_reporte_excel+' '+tipo+" "+userId+" '"+fecha_desde+"' '"+fecha_hasta+"' "+gue_id+" "+emp_id_operador+" "+men_id+" "+despachador_id+" '"+ordenado_por+"' "+desde_fila+" "+limite_filas+" "+userId;					
                           //let cmd = 'python3 '+Guia.app.get("python").reporte.run_reporte_birt+' '+tipo+" '"+extension+"' "+'\'-p "p_desde='+fecha_desde+'" -p "p_hasta='+fecha_hasta+'" -p "p_gue_id='+gue_id+'" -p "p_emp_id_operador='+emp_id_operador+'" -p "p_men_id='+men_id+'" -p "p_despachador_id='+despachador_id+'" -p "p_ordenado_por='+ordenado_por+'" -p "p_desde_fila='+desde_fila+'" -p "p_limite_filas='+limite_filas+'" -p "p_usu_id='+userId+'"\' '+userId+' \''+descripcion+'\'';
                           console.log(cmd);
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
    Guia.exportarListaGuiasDetalle = (fecha_desde,fecha_hasta,gue_id,emp_id_operador,men_id,despachador_id,options, next) => {
        var ds = Guia.dataSource;
        let valores = options && options.accessToken;
		let token = valores && valores.id;
        let userId = valores && valores.userId;
        let extension = 'XLSX';
        let tipo = '12';     
        descripcion='Reporte detallado de guías';

        if(extension != 'PDF' && extension != 'XLSX'){
            next(null,{error:true,mensaje:'Extension es erroneo'});
        }else{                           
            Guia.app.models.user.findById(
               userId,{},
               (err,data)=>{
                   if(err)next(err);
                   else{
                       if(!data){
                           next("Usuario no tiene acceso");
                       }else{	//descarga bien con el nuevo python					
                        let cmd = 'python3 '+Guia.app.get("python").reporte.run_reporte_excel+' '+tipo+" "+userId+" '"+fecha_desde+"' '"+fecha_hasta+"' "+gue_id+" "+emp_id_operador+" "+men_id+" "+despachador_id+" "+userId;
                        //let cmd = 'python3 '+Guia.app.get("python").reporte.run_reporte_birt+' '+tipo+" '"+extension+"' "+'\' -p "p_desde='+fecha_desde+'" -p "p_hasta='+fecha_hasta+'" -p "p_gue_id='+gue_id+'" -p "p_emp_id_operador='+emp_id_operador+'" -p "p_men_id='+men_id+'" -p "p_despachador_id='+despachador_id+'" -p "p_usu_id='+userId+'"\' '+userId+' \''+descripcion+'\'';
                        console.log(cmd);
                            exec(cmd, (err, stdout, stderr) => {
                               if (err) {//console.log("error:",err);
                                   next(null, { error: true, mensaje: err });
                               }else{
                                   //console.log("resultado:",stdout);
                                   next(null, { error: false, archivo: stdout });
                               }
                           });                           
                       }
                   }
               }
            );
        } 
    };
    Guia.ImpimirGuiaDetalle = (gui_id,men_id,options, next) => {
        var converter = require('office-converter')();
        var Api2Pdf = require('api2pdf');   
        var a2pClient = new Api2Pdf('6d2412ec-3962-4270-897c-1cdc2e061f0f');
        var ds = Guia.dataSource;
        let valores = options && options.accessToken;
		let token = valores && valores.id;
        let userId = valores && valores.userId;
         
        let extension = 'PDF';
        let tipo = '13'; 
        let descripcion='Reporte de guía '+gui_id;

        if(extension != 'PDF' && extension != 'XLSX'){
            next(null,{error:true,mensaje:'Extension es erroneo'});
        }else{              
            Guia.app.models.user.findById(
               userId,{},
               (err,data)=>{
                   if(err)next(err);
                   else{
                       if(!data){
                           next("Usuario no tiene acceso");
                       }else{	
                        let gui_idint = parseInt(gui_id);
                        let userIdint = parseInt(userId);
                        let tipoint = parseInt(tipo);
                        let men_idint = parseInt(men_id);
                        console.log(typeof tipoint, typeof userIdint, typeof gui_idint, typeof men_idint)					
                        let cmd = 'python3 '+Guia.app.get("python").reporte.run_reporte_excel+' '+tipoint+' '+userIdint+' '+gui_idint+' '+userIdint+' '+men_idint;
                            //let cmd = 'python3 '+Guia.app.get("python").reporte.run_reporte_birt+' '+tipo+" '"+extension+"' "+'\'-p "guia='+gui_id+'" -p "mensajero='+men_id+'" -p "usuario='+userId+'"\' '+userId+' \''+descripcion+'\'';
                            console.log(cmd);
                            exec(cmd, (err, stdout, stderr) => {
                               if (err) {
                                   console.log("error:",err);
                                   next(null, { error: true, mensaje: err });
                               }else{
                                    console.log("resultado:",stdout);
                                    console.log("ejecuto bien el comando");
                                    let archivoPdf = stdout.substring(0,stdout.indexOf('.'))+'.pdf';
                                    cmd = 'unoconv -f pdf /mnt/nfs/reportes/'+ stdout;
                                    exec(cmd, (err, stdout_, stderr) => {
                                        if (err) {console.log("error:",err);
                                            next(null, { error: true, mensaje: err });
                                        }else{
                                            next(null, { error: false, archivo: archivoPdf });
         
                                        }
                                    });   
                                    

                               }
                           });                           
                       }
                   }
               }
            );
        } 
    };

    Guia.DescargarExcelGuia = (gui_id,options, next) => {
        let valores = options && options.accessToken;
        let userId = valores && valores.userId;
         
        let extension = 'XLSX';
        let tipo = '21'; 
        let descripcion='Reporte detalle de guía';

        if(extension != 'PDF' && extension != 'XLSX'){
            next(null,{error:true,mensaje:'Extension es erroneo'});
        }else{             
            Guia.app.models.user.findById(
               userId,{},
               (err,data)=>{
                   if(err)next(err);
                   else{
                       if(!data){
                           next("Usuario no tiene acceso");
                       }else{						
                        //let cmd = 'python3 '+Guia.app.get("python").reporte.run_reporte_birt+' '+tipo+" '"+extension+"' "+'\'-p "p_guia='+gui_id+'" -p "p_usuario='+userId+'"\' '+userId+' \''+descripcion+'\'';
                        let cmd = 'python3 '+Guia.app.get("python").reporte.run_reporte_excel+' '+tipo+" "+userId+" "+gui_id+" "+userId;//descarga bien con el nuevo python	
                        console.log(cmd);
                            exec(cmd, (err, stdout, stderr) => {
                               if (err) {console.log("error:",err);
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
    Guia.remoteMethod('exportarListaGuias', {
        accepts: [
          {arg: "fecha_desde", type: "string", required: true },        
          {arg: "fecha_hasta", type: "string", required: true },
          {arg: "gue_id", type: "number", required: false },
          {arg: "emp_id_operador", type: "number", required: false },        
          {arg: "men_id", type: "number", required: false },
          {arg: "despachador_id", type: "number", required: false },
          {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: { arg: 'response', type: 'object', root: true },
        http: { verb: 'GET', path: '/exportarListaGuias' }
    });
    Guia.remoteMethod('exportarListaGuiasDetalle', {
        accepts: [
          {arg: "fecha_desde", type: "string", required: true },        
          {arg: "fecha_hasta", type: "string", required: true },
          {arg: "gue_id", type: "number", required: false },
          {arg: "emp_id_operador", type: "number", required: false },        
          {arg: "men_id", type: "number", required: false },
          {arg: "despachador_id", type: "number", required: false },
          //{arg: "suc_id", type: "number", required: true },
          {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: { arg: 'response', type: 'object', root: true },
        http: { verb: 'GET', path: '/exportarListaGuiasDetalle' }
    });
    Guia.remoteMethod('ImpimirGuiaDetalle', {
        accepts: [
            {arg: "gui_id", type: "string", required: true },        
            {arg: "men_id", type: "number", required: false },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: { arg: 'response', type: 'object', root: true },
        http: { verb: 'GET', path: '/ImpimirGuiaDetalle' }
    });
    Guia.remoteMethod('DescargarExcelGuia', {
        accepts: [
            {arg: "gui_id", type: "string", required: true },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: { arg: 'response', type: 'object', root: true },
        http: { verb: 'GET', path: '/DescargarExcelGuia' }
    });
}