var { exec } = require('child_process');

module.exports = (Cliente) => {

  Cliente.crear = (id,operador,cliente,ruc,abreviado,direccion,distrito,next) => {
      var clienteUpd = null;
     Promise.resolve()      
      .then(function(){
        return new Promise(function(resolve, reject) { 
          

            Cliente.findOne({
              where:{
                emp_id_operador:operador,
                emp_id_cliente:cliente
              }
            },
            (err,clienteTemp)=>{
                if(err) reject(err);
                else{
                  if(clienteTemp){
                    if( id > 0){
                      clienteUpd = clienteTemp;
                      resolve();
                    }else{
                      next(null,{error:true,mensaje:'Cliente ya se encuentra registrado'});
                    }
                  }
                  else{      
                    if( id > 0){            
                      next(null,{error:true,mensaje:'Cliente a actualizar es erronea'});                      
                    }else{
                      resolve();                      
                    }
                  }
                }
            });
          
        });
      })
      .then(function() {
        return new Promise(function(resolve, reject) { 
          Cliente.app.models.empresa.findById(cliente,{},
            (err,clienteTemp)=>{
              if(err) reject(err);
              else{
                if(clienteTemp==null) next(null,{error:true,mensaje:"Cliente es erroneo"} ); 
                else{
                  clienteTemp.updateAttributes({
                    emp_ruc:ruc,
                    emp_abrev:abreviado,
                    emp_direccion:direccion,
                    emp_ubigeo:distrito
                  },
                  (err,clienteTemp)=>{
                    if(err) reject(err);
                    else resolve();                    
                  });
                }
              }
            });


        });
      })
      .then(function(){
        return new Promise(function(resolve, reject) {   
          if(id>0){     
            console.log("update");
            console.log(clienteUpd);
              clienteUpd.updateAttributes({
                emp_id_operador:operador,
                emp_id_cliente:cliente
              },
              (err,clienteTemp)=>{
                if(err) reject(err);
                else{
                  next(null,{error:false,mensaje:'Cliente actualizado',data:clienteTemp});
                }
              });
                //next(null,{error:false,mensaje:'Cliente actualizado',data:clienteUpd});
          }else{         
            console.log("create");
            Cliente.create({
              emp_id_operador:operador,
              emp_id_cliente:cliente
            },
            (err,clienteTemp)=>{
              if(err) reject(err);
              else{
                next(null,{error:false,mensaje:'Cliente registrado',data:clienteTemp});
              }
            });
          }
        });
      })
    .catch(function(err){
      console.log(err);
      next(null,{error:true,mensaje:'Ocurrio un error, vuelva a intentar en unos minutos.....'});
    });
  };

  Cliente.exportarexcel = (operador,cliente,options, next) => {
    var ds = Cliente.dataSource;
    let valores = options && options.accessToken;
    let userId = valores && valores.userId;
    let extension = 'XLSX';
    let tipo = '20';
    descripcion='Reporte productos';

    if(extension != 'PDF' && extension != 'XLSX'){
        next(null,{error:true,mensaje:'Extension es erroneo'});
    }else{
                       
        Cliente.app.models.user.findById(
          userId,{},
          (err,data)=>{
              if(err)next(err);
              else{
                  if(!data){
                      next("Usuario no tiene acceso");
                  }else{						
                    //let cmd = 'python3 '+Cliente.app.get("python").reporte.run_reporte_birt+' '+tipo+" '"+extension+"' "+'\'-p "operador='+operador+'" -p "cliente='+cliente+'"-p "usuario='+userId+'"\' '+userId+' \''+descripcion+'\'';
                    let cmd = 'python3 '+Cliente.app.get("python").reporte.run_reporte_excel+' '+tipo+' '+userId+' '+operador+' '+cliente+' '+userId;
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

  Cliente.remoteMethod('crear', {
    accepts: [
      {arg: 'id', type: 'number', required: true},  
      {arg: 'operador', type: 'number', required: true},     
      {arg: 'cliente', type: 'number', required: true},
      {arg: 'ruc', type: 'string', required: true},
      {arg: 'abreviado', type: 'string', required: true},
      {arg: 'direccion', type: 'string', required: true},
      {arg: 'distrito', type: 'number', required: true},
    ],
    returns: {
      arg: 'response',
      type: 'object',
      root: true
    },
    http: {
      verb: 'POST',
      path: '/crear'
    }
  });

  Cliente.remoteMethod('exportarexcel', {
    accepts: [        
      {arg: 'operador', type: 'number', required: true},  
      {arg: 'cliente', type: 'number', required: true},  
      {arg: "options", type: "object", 'http': "optionsFromRequest"}
    ],
    returns: {
    arg: 'response',
    type: 'object',
    root: true
    },
    http: {
    verb: 'POST',
    path: '/exportarexcel'
    }
  });
}