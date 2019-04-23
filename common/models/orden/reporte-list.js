var { exec } = require('child_process');

module.exports = (Orden) => {
    Orden.exportarListaOS = (fecha_desde,fecha_hasta,options, next) => {
        var ds = Orden.dataSource;
        let valores = options && options.accessToken;
        let token = valores && valores.id;
        let userId = valores && valores.userId;

        let extension = 'XLSX';
        let tipo = '10';

        if(extension != 'PDF' && extension != 'XLSX'){
            next(null,{error:true,mensaje:'Extensión es erróneo'});
        }else{            
            Orden.app.models.user.findById(
                userId,{},
                (err,data)=>{
                    if(err)next(err);
                    else{
                        if(!data){
                            next("Usuario no tiene acceso");
                        }else{
                            let cmd = 'python3 '+Orden.app.get("python").reporte.run_reporte_excel+' '+tipo+' '+userId+" '"+fecha_desde+"' '"+fecha_hasta+"'";
                            console.log(cmd);
                            //let cmd = 'python3 '+Orden.app.get("python").reporte.run_reporte_birt+' '+tipo+" '"+extension+"' "+'\'-p "desde='+fecha_desde+'" -p "hasta='+fecha_hasta+'"\' '+userId+' \'Consolidado OS desde '+fecha_desde+' hasta '+fecha_hasta+'\'';
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
            )
        }
    };

    /*Definición*/
    Orden.remoteMethod('exportarListaOS', {
        accepts: [
            {arg: "fecha_desde", type: "string", required: true },        
            {arg: "fecha_hasta", type: "string", required: true },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
          ],
          returns: { arg: 'response', type: 'object', root: true },
          http: { verb: 'GET', path: '/exportarListaOS' }
    });
}
