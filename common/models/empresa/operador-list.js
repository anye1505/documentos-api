
module.exports = (Empresa) => {

  Empresa.operador = (options,next) => {
    var ds = Empresa.dataSource;
    /*page = page || 1;
    limit = limit || 10;

    var skip = (page - 1) * limit;
    */


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
                reject(err);
              }else{
                if(!data){
                  reject("No se encontraron operadores para ud.");
                }else{      
                  resolve(data.emp_id);     
                }
              }
            }
          )
      })
    })
    .then((emp_id)=>{
      return new Promise(function(resolve, reject) {
        var sql = "select * from general.vista_operador where id_courier=$1";

        ds.connector.execute(sql, [emp_id], function(err, data) {
            if (err){
              reject(err);      
            }else{
              next(null,data);
            }
        });   
      })
    })
    .catch(function(err){
      console.log(err);
      next("Ocurrio un error al cargar formatos.");   
    });
  };

  Empresa.remoteMethod('operador', {
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
      path: '/operador'
    }
  });
}