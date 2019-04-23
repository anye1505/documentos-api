
module.exports = (Producto) => {

  Producto.actualizar = (prd_id, nombre , nombre_docs , modeloDistribucion , reglaDistribucion , tipoCargo, prd_tipo, next) => {
      var productoUpd = null;
     Promise.resolve()      
      .then(function(){
        return new Promise(function(resolve, reject) { 
          

            Producto.findOne({
              where:{
                prd_id:prd_id
              }
            },
            (err,productoTemp)=>{
                if(err) reject(err);
                else{
                  if(productoTemp){
                    productoUpd = productoTemp;
                    resolve();
                  }else{            
                      next(null,{error:true,mensaje:'Producto a actualizar es erronea'}); 
                  }
                }
            });          
        });
      })
      .then(function(){
        return new Promise(function(resolve, reject) {  console.log("tipo=",prd_tipo) 
              productoUpd.updateAttributes({
                prd_nombre:nombre,
                prd_tipo:prd_tipo,
                prd_nombre_docs:nombre_docs,
                mdi_id:modeloDistribucion,
                rdi_id:reglaDistribucion,
                tca_id:tipoCargo
              },
              (err,productoTemp)=>{
                if(err) reject(err);
                else{
                  next(null,{error:false,mensaje:'Producto actualizado',data:productoTemp});
                }
              });
                //next(null,{error:false,mensaje:'Cliente actualizado',data:clienteUpd});
          
        });
      })
    .catch(function(err){
      console.log(err);
      next(null,{error:true,mensaje:'Ocurrio un error, vuelva a intentar en unos minutos.....'});
    });
  };

  Producto.remoteMethod('actualizar', {
    accepts: [ 
      {arg: 'prd_id', type: 'number', required: true},     
      {arg: 'nombre', type: 'string', required: true},     
      {arg: 'nombre_docs', type: 'string', required: true},
      {arg: 'modeloDistribucion', type: 'number', required: true},
      {arg: 'reglaDistribucion', type: 'number', required: true},
      {arg: 'tipoCargo', type: 'number', required: true},
      {arg: 'prd_tipo', type: 'string', required: true}, 
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