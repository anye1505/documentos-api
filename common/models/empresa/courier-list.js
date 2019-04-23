
module.exports = (Empresa) => {

  Empresa.courier = (next) => {
    var ds = Empresa.dataSource;
    var data = {};

    var sql = "select * from general.vista_courier order by emp_abrev";
      ds.connector.execute(sql, [], function(err, data) {
          if (err){
            next(err);      
          }   
          next(null, data);
      });   
  };

  Empresa.courierLogo = (options, next) => {
    var ds = Empresa.dataSource;
    const valores = options && options.accessToken;
    const userId = valores && valores.userId;

    Promise.resolve()
      .then(()=> {
      return new Promise(function(resolve, reject) {
        Empresa.app.models.user.findById(
          userId,{},
          (err,data)=>{
            if(err){           
              reject(err);
            }else{
              if(!data){
                reject("No se encontraron formatos para ud.");
              }else{      
                resolve(data.emp_id);
              }
            }
          }
        )
      })
    })
    .then((emp_id)=>{
      var sql = "select emp_logotipo from general.empresa where emp_id = $1";
      ds.connector.execute(sql, [emp_id], function(err, data) {
          if (err){            
            reject(err);
          }else{
            next(null, data);
          }
      });  
    })
    .catch(function(err){
      console.log(err);
      next("Ocurrio un error al cargar logo.");   
    });
  };
  Empresa.remoteMethod('courier', {
    accepts: [
    ],
    returns: {
      arg: 'response',
      type: 'object',
      root: true
    },
    http: {
      verb: 'GET',
      path: '/courier'
    }
  });

  Empresa.remoteMethod('courierLogo', {
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
      path: '/courierLogo'
    }
  });
}