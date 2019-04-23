module.exports = (Sucursal) => {

    Sucursal.sucursales = (options, next) => {
        var ds = Sucursal.dataSource;

        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const userId = valores && valores.userId;

        Promise.resolve()
        .then(()=> {
            return new Promise(function(resolve, reject) {
                Sucursal.app.models.user.findById(
                userId,{},
                (err,data)=>{
                    if(err){         
                    reject(err);
                    }else{
                    if(!data){
                        reject("No se encontraron operadores para ud.");
                    }else{      
                        resolve(data.suc_id);     
                    }
                    }
                }
                )
            })
        })
        .then((suc_id)=>{
            return new Promise(function(resolve, reject) {
                var sql = "select sucursal_id as suc_id,courier_nombre||' - ' ||sucursal_nombre as nombre from general.vista_sucursal where sucursal_id<>$1 and courier_id<>3 order by 2";
                ds.connector.execute(sql, [suc_id], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });   
            })
        })
        .catch(function(err){
            console.log(err);
            next("Ocurrio un error al cargar Sucursales.");   
        });
  
    };

    Sucursal.sucursalseleccionada = (options, next) => {
        var ds = Sucursal.dataSource;

        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const userId = valores && valores.userId;

        Promise.resolve()
        .then(()=> {
            return new Promise(function(resolve, reject) {
                Sucursal.app.models.user.findById(
                userId,{},
                (err,data)=>{
                    if(err){         
                    reject(err);
                    }else{
                    if(!data){
                        reject("No se encontraron operadores para ud.");
                    }else{      
                        resolve(data.suc_id);     
                    }
                    }
                }
                )
            })
        })
        .then((suc_id)=>{
            return new Promise(function(resolve, reject) {
                var sql = "select sucursal_id as suc_id,courier_nombre||' - ' ||sucursal_nombre as nombre from general.vista_sucursal where sucursal_id<>$1 order by 2";
                ds.connector.execute(sql, [suc_id], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });   
            })
        })
        .catch(function(err){
            console.log(err);
            next("Ocurrio un error al cargar Sucursales.");   
        });
  
    };

    Sucursal.sucursalesRecep = (options, next) => {
        var ds = Sucursal.dataSource;

        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const userId = valores && valores.userId;

        Promise.resolve()
        .then(()=> {
            return new Promise(function(resolve, reject) {
                Sucursal.app.models.user.findById(
                userId,{},
                (err,data)=>{
                    if(err){         
                    reject(err);
                    }else{
                    if(!data){
                        reject("No se encontraron operadores para ud.");
                    }else{      
                        resolve(data.emp_id);     
                    }
                    }
                }
                )
            })
        })
        .then((emp_id)=>{
            return new Promise(function(resolve, reject) {
                var sql = "select sucursal_id, courier_nombre ||' ' || sucursal_nombre sucursal from general.vista_sucursal where courier_id in (select emp_id from general.vista_operador where id_courier=$1)";
                ds.connector.execute(sql,[emp_id], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });   
            })
        })
        .catch(function(err){
            console.log(err);
            next("Ocurrio un error al cargar Sucursales.");   
        });
  
    };
  
    Sucursal.remoteMethod('sucursales', {
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
        path: '/sucursales'
      }
    });

    Sucursal.remoteMethod('sucursalseleccionada', {
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
          path: '/sucursalseleccionada'
        }
      });

    Sucursal.remoteMethod('sucursalesRecep', {
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
        path: '/sucursalesRecep'
    }
    });

}