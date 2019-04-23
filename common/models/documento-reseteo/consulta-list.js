module.exports = function(documentoReseteo) {

    /* Cuerpo */
    documentoReseteo.consultaMultiple = (fecha_desde, fecha_hasta, usu_reseteo, tir_id, ordenado_por, desde_fila, limite_filas, options, next) => {
        var ds = documentoReseteo.dataSource;
        
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const userId = valores && valores.userId;
            
        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select * from proceso.spu_reseteo_consultar_multiple($1,$2,$3,$4,$5,$6,$7,$8);";
                ds.connector.execute(sql, [
                    fecha_desde, fecha_hasta, usu_reseteo, tir_id, ordenado_por, desde_fila, limite_filas,userId
                ], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });   
              })
          })
          .catch(function(err){
            console.log(err); next("Ocurrio un error al cargar Despachador.");   
        });
    };
    documentoReseteo.consultarCodigoBarras = (codigo_barra, tipo, options, next) => {
        var ds = documentoReseteo.dataSource;
        
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const userId = valores && valores.userId;
            
        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select * from proceso.spu_reseteo_consultar_cb($1,$2,$3);";
                ds.connector.execute(sql, [codigo_barra,userId,tipo], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });   
              })
          })
          .catch(function(err){
            console.log(err); next("Ocurrio un error cosnultar los datos del código de barra.");   
        });
    };
    /* Definición */
    documentoReseteo.remoteMethod('consultaMultiple', {
        accepts: [
            {arg: "fecha_desde", type: "string", required: false },
            {arg: "fecha_hasta", type: "string", required: false },
            {arg: "usu_reseteo", type: "number", required: false },
            {arg: "tir_id", type: "number", required: false },
            {arg: "ordenado_por", type: "string", required: false },
            {arg: "desde_fila", type: "number", required: true },
            {arg: "limite_filas", type: "number", required: true },
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
    documentoReseteo.remoteMethod('consultarCodigoBarras', {
        accepts: [
            {arg: "codigo_barra", type: "string", required: false },
            {arg: "tipo", type: "number", required: false },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
            arg: 'response',
            type: 'object',
            root: true
        },
        http: {
            verb: 'GET',
            path: '/consultarCodigoBarras'
        }
    });
};