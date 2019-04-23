
module.exports = (Empresa) => {

  Empresa.formato = (options, next) => {
    var ds = Empresa.dataSource;
    var data = {};


    const valores = options && options.accessToken;
    const token = valores && valores.id;
    const userId = valores && valores.userId;

     Promise.resolve()
      .then(()=> {
      return new Promise(function(resolve, reject) {

        Empresa.app.models.user.findById(
          userId,{},
          (err,data)=>{
            if(err){
              //console.log(err);
              //next({error:true,mensaeje:"Ocurrio un error al cargar formatos."});              
              reject(err);
            }else{
              if(!data){
                reject("No se encontraron formatos para ud.");
                //next({error:true,mensaje:"No se encontraron formatos para ud."});
              }else{      
                resolve(data.emp_id);     
                //let p_emp_id_courier = data.emp_id;//id de courier - empresa del usuario
              }
            }
          }
        )
      })
    })
    .then((emp_id)=>{
      var sql = "select * from proceso.vista_formato_os where emp_id_courier = $1";
      ds.connector.execute(sql, [emp_id], function(err, data) {
          if (err){
            //console.log(err);
            //next({error:true,mensaeje:"Ocurrio un error al cargar formatos."});            
            reject(err);
          }else{
            next(null, data);
          }
      });  
    })
    .catch(function(err){
      console.log(err);
      next("Ocurrio un error al cargar formatos.");   
    });






     
  };

  Empresa.remoteMethod('formato', {
    accepts: [
          {arg: "options", type: "object", 'http': "optionsFromRequest"}
    ],
    returns: {
      arg: 'response',
      type: 'object',
      root: true
    },
    http: {
      verb: 'GET',
      path: '/formato'
    }
  });
}