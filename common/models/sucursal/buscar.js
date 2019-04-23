
module.exports = (Sucursal) => {

  Sucursal.buscar = (options, next) => {
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
                  resolve(data.emp_id);     
                }
              }
            }
          )
      })
    })
    .then((emp_id)=>{
      return new Promise(function(resolve, reject) {
        Sucursal.find({
        	where:{
            emp_id:emp_id
          }
        },
        (err,data)=>{
        	if(err){
              reject(err);      
        	}else{
              next(null,data);
        	}
        }) 
      })
    })
    .catch(function(err){
      console.log(err);
      next("Ocurrio un error al cargar formatos.");   
    });

  };

  Sucursal.remoteMethod('buscar', {
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
      path: '/buscar'
    }
  });


}