
module.exports = (ReglaDistribucion) => {

  ReglaDistribucion.actualizar = (
        rdi_id,
        rdi_nombre, 
        rdi_si_entrega,
        rdi_si_dirincompleta,
        rdi_si_entregasello,
        rdi_si_dirnoexiste,
        rdi_si_entregapuerta,
        rdi_si_semudo,
        rdi_si_entregabuzon,
        rdi_si_ausente,
        rdi_si_rechazado,
        rdi_si_desconocido,
        rdi_si_fallecido,

        rdi_si_sabado,
        rdi_si_domingo,
        rdi_si_feriado,

        rdi_dias_dist_centrico,
        rdi_dias_dist_alejado,
        rdi_dias_dist_rural,
        rdi_dias_dist_periferico,
        rdi_dias_dist_balneario,


        rdi_si_primera_fecha,
        rdi_si_segunda_fecha,

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
                  next(null,{error:true,mensaje:'Regla no encontrado.'});
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
            rdi_nombre : rdi_nombre, 
            rdi_si_entrega : rdi_si_entrega,
            rdi_si_dirincompleta : rdi_si_dirincompleta,
            rdi_si_entregasello : rdi_si_entregasello,
            rdi_si_dirnoexiste : rdi_si_dirnoexiste,
            rdi_si_entregapuerta : rdi_si_entregapuerta,
            rdi_si_semudo : rdi_si_semudo,
            rdi_si_entregabuzon : rdi_si_entregabuzon,
            rdi_si_ausente : rdi_si_ausente,
            rdi_si_rechazado : rdi_si_rechazado,
            rdi_si_desconocido : rdi_si_desconocido,
            rdi_si_fallecido : rdi_si_fallecido,

            rdi_si_sabado : rdi_si_sabado,
            rdi_si_domingo : rdi_si_domingo,
            rdi_si_feriado : rdi_si_feriado,

            rdi_dias_dist_centrico : rdi_dias_dist_centrico,
            rdi_dias_dist_alejado : rdi_dias_dist_alejado,
            rdi_dias_dist_rural : rdi_dias_dist_rural,
            rdi_dias_dist_periferico : rdi_dias_dist_periferico,
            rdi_dias_dist_balneario : rdi_dias_dist_balneario,

            rdi_si_primera_fecha : rdi_si_primera_fecha,
            rdi_si_segunda_fecha : rdi_si_segunda_fecha,
            emp_id_courier : emp_id,
            rdi_usu_modif: userId,
            rdi_fmodificacion:new Date()
          },
            (err,reglaTemp)=>{
              if(err){          
                  reject(err);
              }
              else{
                if(reglaTemp==null)
                  next(null,{error:true,mensaje:'Error al registrar.'});
                else{                  
                  next(null,{error:false,mensaje:'Regla registrada.',data:reglaTemp});
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

  ReglaDistribucion.remoteMethod('actualizar', {
    accepts: [
      {arg: 'rdi_id', type: 'number', required: true}, 

      {arg: 'rdi_nombre', type: 'string', required: true}, 
      {arg: 'rdi_si_entrega', type: 'boolean', required: true}, 
      {arg: 'rdi_si_dirincompleta', type: 'boolean', required: true}, 
      {arg: 'rdi_si_entregasello', type: 'boolean', required: true}, 
      {arg: 'rdi_si_dirnoexiste', type: 'boolean', required: true}, 
      {arg: 'rdi_si_entregapuerta', type: 'boolean', required: true}, 
      {arg: 'rdi_si_semudo', type: 'boolean', required: true}, 
      {arg: 'rdi_si_entregabuzon', type: 'boolean', required: true}, 
      {arg: 'rdi_si_ausente', type: 'boolean', required: true}, 
      {arg: 'rdi_si_rechazado', type: 'boolean', required: true}, 
      {arg: 'rdi_si_desconocido', type: 'boolean', required: true}, 
      {arg: 'rdi_si_fallecido', type: 'boolean', required: true}, 

      {arg: 'rdi_si_sabado', type: 'boolean', required: true}, 
      {arg: 'rdi_si_domingo', type: 'boolean', required: true}, 
      {arg: 'rdi_si_feriado', type: 'boolean', required: true}, 

      {arg: 'rdi_dias_dist_centrico', type: 'number', required: true}, 
      {arg: 'rdi_dias_dist_alejado', type: 'number', required: true}, 
      {arg: 'rdi_dias_dist_rural', type: 'number', required: true}, 
      {arg: 'rdi_dias_dist_periferico', type: 'number', required: true}, 
      {arg: 'rdi_dias_dist_balneario', type: 'number', required: true}, 


      {arg: 'rdi_si_primera_fecha', type: 'boolean', required: true}, 
      {arg: 'rdi_si_segunda_fecha', type: 'boolean', required: true}, 

      {arg: "options", type: "object", 'http': "optionsFromRequest"}

    ],
    returns: {
      arg: 'response',
      type: 'object',
      root: true
    },
    http: {
      verb: 'POST',
      path: '/actualizar'
    }
  });
}