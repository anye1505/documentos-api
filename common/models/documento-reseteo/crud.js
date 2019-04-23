module.exports = function(documentoReseteo) {

    /* Cuerpo */
    documentoReseteo.registrarCabecera = (dre_id, tir_id, dre_motivo, options, next) => {
        var ds = documentoReseteo.dataSource;
        
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const userId = valores && valores.userId;
            
        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select * from proceso.spu_reseteo_actualizar($1,$2,$3,$4);";
                ds.connector.execute(sql, [dre_id, tir_id, dre_motivo, userId], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });   
              })
          })
          .catch(function(err){
            console.log(err); next("Ocurrio un error al registrar el reseteo de documentos.");   
        });
    };
    documentoReseteo.registrarDetalle = (dre_id, codigo_barra, options, next) => {
        var ds = documentoReseteo.dataSource;
        
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const userId = valores && valores.userId;
            
        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select * from proceso.spu_reseteo_detalle_actualizar($1,$2,$3);";
                ds.connector.execute(sql, [dre_id, codigo_barra, userId], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });   
              })
          })
          .catch(function(err){
            console.log(err); next("Ocurrio un error al agregar el documento al reseteo.");   
        });
    };
    /* Definición */
    documentoReseteo.remoteMethod('registrarCabecera', {
        accepts: [
            {arg: "dre_id", type: "number", required: true },
            {arg: "tir_id", type: "number", required: true },
            {arg: "dre_motivo", type: "string", required: true },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
            arg: 'response',
            type: 'object',
            root: true
        },
        http: {
            verb: 'GET',
            path: '/registrarCabecera'
        }
    });
    documentoReseteo.remoteMethod('registrarDetalle', {
        accepts: [
            {arg: "dre_id", type: "number", required: true },
            {arg: "codigo_barra", type: "string", required: true },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
            arg: 'response',
            type: 'object',
            root: true
        },
        http: {
            verb: 'GET',
            path: '/registrarDetalle'
        }
    });
}