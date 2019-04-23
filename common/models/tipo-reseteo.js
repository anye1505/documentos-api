module.exports = function(TipoReseteo) {
    /* Cuerpo */
    TipoReseteo.lista = (options, next) => {
        var ds = TipoReseteo.dataSource;
        
        /*const valores = options && options.accessToken;
        const token = valores && valores.id;
        const userId = valores && valores.userId;*/
    
        Promise.resolve().then(()=>{
        return new Promise(function(resolve, reject) {
            var sql = "select tir_id, tir_descripcion from proceso.tipo_reseteo order by 1;";
            ds.connector.execute(sql, [
            ], function(err, data) {
                if (err){ reject(err); }
                else{ next(null,data); }
            });   
            })
        }).catch(function(err){
            console.log(err); next("Ocurrio un error al cargar los tipos de reseteo");   
        }); 
    };
    /* Definición */
    TipoReseteo.remoteMethod('lista', {
        accepts: [
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
            arg: 'response',
            type: 'object',
            root: true
        },
        http: {
            verb: 'GET',
            path: '/lista'
        }
    });
};
