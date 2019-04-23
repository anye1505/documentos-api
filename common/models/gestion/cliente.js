module.exports = (Gestion) => {
    Gestion.cerrar = (ord_ids,options, next) => {
        var ds = Gestion.dataSource;
        const valores = options && options.accessToken;
        const usu_id = valores && valores.userId;
     
         Promise.resolve().then(()=>{
          return new Promise(function(resolve, reject) {
              var sql = "select * from  proceso.spu_ordenes_cerrar($1,$2);";
              ds.connector.execute(sql,[ord_ids,usu_id], function(err, data) {
                  if (err){ reject(err); }
                  else{ next(null,data); }
              });   
            })
        })
        .catch(function(err){
          console.log(err); next("Ocurrio un error al cerrar orden(es).");   
        });
    };

    Gestion.abrir = (ord_ids,options, next) => {
        var ds = Gestion.dataSource;
        const valores = options && options.accessToken;
        const usu_id = valores && valores.userId;
     
         Promise.resolve().then(()=>{
          return new Promise(function(resolve, reject) {
              var sql = "select * from  proceso.spu_ordenes_abrir($1,$2);";
              ds.connector.execute(sql,[ord_ids,usu_id], function(err, data) {
                  if (err){ reject(err); }
                  else{ next(null,data); }
              });   
            })
        })
        .catch(function(err){
          console.log(err); next("Ocurrio un error al abrir orden(es).");   
        });
    };

    Gestion.remoteMethod('cerrar', {
        accepts: [
          {arg: "ord_ids", type: "string", required: true },
          {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
          arg: 'response',
          type: 'object',
          root: true
        },
        http: {
          verb: 'POST',
          path: '/clientes/ordenes/cerrar'
        }
    });

    Gestion.remoteMethod('abrir', {
        accepts: [
          {arg: "ord_ids", type: "string", required: true },
          {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
          arg: 'response',
          type: 'object',
          root: true
        },
        http: {
          verb: 'POST',
          path: '/clientes/ordenes/abrir'
        }
    });
}