
module.exports = (Orden) => {

  Orden.eliminar = (ord_id, options, next) => {

    const valores = options && options.accessToken;
    const token = valores && valores.id;
    const userId = valores && valores.userId;

      var ds = Orden.dataSource;

    Promise.resolve()
    .then(function() {
      return new Promise(function(resolve, reject) {
        
        let sql = "";

        //sql = "select * from  proceso.sp_doc_recepcionar_archivo($1,$2,$3, $4, $5);";
        sql = "select * from  proceso.spu_orden_eliminar($1, $2);";

        let params = [ord_id, userId];
        //console.log(params);
        ds.connector.execute(sql, params, function(err, data) {
          if (err){
                reject(err);      
          }else{
            next(null,data[0]);
          }               
        });
      });
    })
    .catch(function(err){
      console.log(err);
      next( 'Ocurrio un error, vuelva a intentar en unos minutos.....');
    });
  };

  Orden.remoteMethod('eliminar', {
    accepts: [
      {
        arg: 'ord_id',
        type: 'number',
        required: true
      },

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