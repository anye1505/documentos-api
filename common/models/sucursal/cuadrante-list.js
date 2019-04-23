module.exports = (Sucursal) => {
    Sucursal.cuadrantes = (sam_id, options, next) => {
      var ds = Sucursal.dataSource;
      
      Promise.resolve()
      .then(()=>{
        return new Promise(function(resolve, reject) {
            var sql = "select sac_id, sac_nombre, sac_descripcion from general.sucursal_ambito_cuadrante where sam_id=$1";
            ds.connector.execute(sql, [sam_id], function(err, data) {
                if (err){ reject(err); } else{ next(null,data); }
            });
        });
      })
      .catch(function(err){ console.log(err); next("Ocurrio un error al cargar formatos.");   
      });
  
    };
  
    Sucursal.remoteMethod('cuadrantes', {
      accepts: [
        {arg: 'sam_id', type: 'number', required: true},
        {arg: "options", type: "object", 'http': "optionsFromRequest"}
      ],
      returns: {
        arg: 'response',
        type: 'object',
        root: true
      },
      http: {
        verb: 'GET',
        path: '/cuadrantes'
      }
    });
}