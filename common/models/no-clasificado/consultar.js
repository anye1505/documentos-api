module.exports = (NoClasificado) => {
    /*Implementación*/
    NoClasificado.consultaMultiple = (fecha_desde,fecha_hasta,usu_cla_id,desde_fila,limite_filas,ordenado_por,options, next) => {
      var ds = NoClasificado.dataSource;
      const valores = options && options.accessToken;
      const token = valores && valores.id;
      const usu_id = valores && valores.userId;
   
       Promise.resolve().then(()=>{
        return new Promise(function(resolve, reject) {
            var sql = "select * from  proceso.spu_clasificacion_consultar_multiple($1,$2,$3,$4,$5,$6,$7);";
            ds.connector.execute(sql, [
              fecha_desde, fecha_hasta, usu_cla_id,desde_fila,limite_filas,ordenado_por,usu_id
            ], function(err, data) {
                if (err){ reject(err); }
                else{ next(null,data); }
            });   
          })
      })
      .catch(function(err){
        console.log(err); next("Ocurrio un error al cargar Transportista.");   
      });
    };
    NoClasificado.consultaDetalle = (cla_id,options, next) => {
      var ds = NoClasificado.dataSource;
      const valores = options && options.accessToken;
      const token = valores && valores.id;
      const usu_id = valores && valores.userId;

      Promise.resolve().then(()=>{
        return new Promise(function(resolve, reject) {
          var sql = "select * from  proceso.spu_clasificacion_consultar_detalle($1,$2);";
            ds.connector.execute(sql, [cla_id,usu_id], function(err, data) {
                if (err){ reject(err); }
                else{ next(null,data); }
            });
        })
      })
    }
    /*Definición*/
    NoClasificado.remoteMethod('consultaMultiple', {
        accepts: [        
          {arg: "fecha_desde", type: "string", required: true },
          {arg: "fecha_hasta", type: "string", required: true },
          {arg: "usu_cla_id", type: "number", required: true },
          {arg: "desde_fila", type: "number", required: true },
          {arg: "limite_filas", type: "number", required: true },
          {arg: "ordenado_por", type: "string", required: true },
          {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
          arg: 'response',
          type: 'object',
          root: true
        },
        http: {
          verb: 'GET',
          path: '/consultaMultiple'
        }
    });
    NoClasificado.remoteMethod('consultaDetalle', {
      accepts: [        
        {arg: "cla_id", type: "number", required: true },
        {arg: "options", type: "object", 'http': "optionsFromRequest"}
      ],
      returns: {
        arg: 'response',
        type: 'object',
        root: true
      },
      http: {
        verb: 'GET',
        path: '/consultaDetalle'
      }
  });
}