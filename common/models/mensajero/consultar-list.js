module.exports = (Mensajero) => {
    /*Implementación*/
    Mensajero.mensajerobysuc = (suc_id,options, next) => {
      var ds = Mensajero.dataSource;
      const valores = options && options.accessToken;
      const token = valores && valores.id;
      const usu_id = valores && valores.userId;
   
       Promise.resolve().then(()=>{
        return new Promise(function(resolve, reject) {
            var sql = "select * from general.vista_mensajero where suc_id = $1";
            ds.connector.execute(sql,[suc_id], function(err, data) {
                if (err){ reject(err); }
                else{ next(null,data); }
            });   
          })
      })
      .catch(function(err){
        console.log(err); next("Ocurrio un error al cargar Mensajero.");   
      });
    };

    Mensajero.buscar = (suc_id,nombre,apellido,documento,options, next) => {
        var ds = Mensajero.dataSource;
    
        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select * from general.mensajero m inner join general.persona p on m.per_id = p.per_id where m.suc_id = $1 and (p.per_nro_documento ilike $2 or p.per_nombre1 ilike $3 or p.per_nombre2 ilike $4 or p.per_apellido1 ilike $5 or p.per_apellido2 ilike $6)";
                //console.log("sql:",sql);
                ds.connector.execute(sql,[suc_id,'%'+documento+'%','%'+nombre+'%','%'+nombre+'%','%'+apellido+'%','%'+apellido+'%'], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });
            })
        })
        .catch(function(err){
          console.log(err); next("Ocurrio un error al buscar usuario.");   
        });
    
      };

    Mensajero.remoteMethod('mensajerobysuc', {
        accepts: [
            {arg: "suc_id", type: "number", required: true },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
            arg: 'response',
            type: 'object',
            root: true
        },
        http: {
            verb: 'GET',
            path: '/mensajeroporsucursal'
        }
    });

    Mensajero.remoteMethod('buscar', {
        accepts: [
          {arg: "suc_id", type: "number", required: true },
          {arg: "nombre", type: "string", required: false },
          {arg: "apellido", type: "string", required: false },
          {arg: "documento", type: "string", required: false },
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