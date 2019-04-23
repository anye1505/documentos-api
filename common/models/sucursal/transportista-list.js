
module.exports = (Sucursal) => {

    Sucursal.transportista = (options, next) => {
      var ds = Sucursal.dataSource;
      
      const valores = options && options.accessToken;
      const token = valores && valores.id;
      const userId = valores && valores.userId;
   
       Promise.resolve()
      .then(()=> {
        return new Promise(function(resolve, reject) {
            Sucursal.app.models.user.findById(
              userId,{},
              (err,data)=>{
                if(err){         
                  reject(err);
                }else{
                  if(!data){
                    reject("No se encontraron operadores para ud.");
                  }else{      
                    resolve(data.suc_id);     
                  }
                }
              }
            )
        })
      })
      .then((suc_id)=>{
        return new Promise(function(resolve, reject) {
            var sql = "SELECT tra_id, emp_nombre FROM general.vista_transportista order by 2";//where suc_id<>$1
            ds.connector.execute(sql/*, [suc_id]*/, function(err, data) {
                if (err){ reject(err); }
                else{ next(null,data); }
            });   
          })
      })
      .catch(function(err){
        console.log(err);
        next("Ocurrio un error al cargar Transportista.");   
      });
  
    };
  
    Sucursal.remoteMethod('transportista', {
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
        path: '/transportista'
      }
    });
  
  
  }