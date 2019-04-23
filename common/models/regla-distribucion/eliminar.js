
module.exports = (ReglaDistribucion) => {

  ReglaDistribucion.eliminar = (
        rdi_id,
        options,
        next) => {
    
        var reglaSearch = null;

        var valores = options && options.accessToken;
        var token = valores && valores.id;
        var userId = valores && valores.userId;

     Promise.resolve()      

      .then(function(){
        return new Promise(function(resolve, reject) { 
          ReglaDistribucion.findOne(
            {where:{rdi_id:rdi_id}},
            (err,data)=>{
              if(err){
                  reject(err);
              }
              else{
                if(!data){
                  next(null,{error:true,mensaje:'Regla no existe.'});
                }else{
                  reglaSearch = data;
                  resolve();
                }
              }
            });          
        });
      })
      .then(function(){
        return new Promise(function(resolve, reject) { 
          ReglaDistribucion.app.models.user.findOne(
            {where:{id:userId}},
            (err,data)=>{
              if(err){
                  reject(err);
              }
              else{
                if(!data){
                  next(null,{error:true,mensaje:'Error al registrar.'});
                }else{
                  resolve(data.emp_id);
                }
              }
            });          
        });
      })
      .then(function(emp_id) {
        return new Promise(function(resolve, reject) { 
          let ahora = new Date();
          reglaSearch.updateAttributes({
            rdi_usu_elim: userId,
            rdi_feliminacion:new Date()
          },
            (err,reglaTemp)=>{
              if(err){          
                  reject(err);
              }
              else{
                if(reglaTemp==null)
                  next(null,{error:true,mensaje:'Error al registrar.'});
                else{                  
                  next(null,{error:false,mensaje:'Regla eliminada.'});
                }
              }
            });

        });
      })
    .catch(function(err){
      console.log(err);
      next(null,{error:true,mensaje:'Ocurrio un error, vuelva a intentar en unos minutos.....'});
    });
  };

  ReglaDistribucion.remoteMethod('eliminar', {
    accepts: [
      {arg: 'rdi_id', type: 'number', required: true}, 

      {arg: "options", type: "object", 'http': "optionsFromRequest"}

    ],
    returns: {
      arg: 'response',
      type: 'object',
      root: true
    },
    http: {
      verb: 'POST',
      path: '/eliminar'
    }
  });
}