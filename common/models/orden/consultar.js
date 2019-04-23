
module.exports = (Orden) => {

  Orden.buscar = (filter, options, next) => {
    
    const valores = options && options.accessToken;
    const token = valores && valores.id;
    const userId = valores && valores.userId;

    Promise.resolve()
    .then(function() {
      return new Promise(function(resolve, reject) {
        Orden.app.models.user.findById(
        userId,{},
        (err,data)=>{
          if(err){
            reject(err);
          }else{
            if(!data){
              reject("Usuario erroneo");
            }else{
              if(data.suc_id!=null && data.emp_id!=null){
                resolve(data);
              }else{
                reject("Usuario/Courier/Sucursal erroneo");
              }
            }
          }
        })
      });
    })
    .then(function(us) {
      filter.where['emp_id_courier'] = us.emp_id;
      filter.where['suc_id'] = us.suc_id;
      return new Promise(function(resolve, reject) {
        Orden.find(filter         
        ,
        (err,data)=>{
          if(err){
            reject(err);
          }else{
            next(null,data);
          }
        });
      })
    })

    .catch(function(err){
      console.log(err);
      next( 'Ocurrio un error, vuelva a intentar en unos minutos.....');
    });
  };

  Orden.remoteMethod('buscar', {
    accepts: [
      {
        arg: 'filter',
        type: 'object',
        required: false
      },

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


  Orden.contar = (where, options, next) => {

    const valores = options && options.accessToken;
    const token = valores && valores.id;
    const userId = valores && valores.userId;

    Promise.resolve()
    .then(function() {
      return new Promise(function(resolve, reject) {
        Orden.app.models.user.findById(
        userId,{},
        (err,data)=>{
          if(err){
            reject(err);
          }else{
            if(!data){
              reject("Usuario erroneo");
            }else{
              if(data.suc_id!=null && data.emp_id!=null){
                resolve(data);
              }else{
                reject("Usuario/Courier/Sucursal erroneo");
              }
            }
          }
        })
      });
    })

    .then(function(us) {
      where['emp_id_courier'] = us.emp_id;
      where['suc_id'] = us.suc_id;
      
      return new Promise(function(resolve, reject) {
        Orden.count(
          where
        ,
        (err,data)=>{
          if(err){
            reject(err);
          }else{
            next(null,{error:false,count:data});
          }
        });
      })
    })

    .catch(function(err){
      console.log(err);
      next( 'Ocurrio un error, vuelva a intentar en unos minutos.....');
    });
    /*var ds = orden.dataSource;
    var data = {};

    var sql = "select * from proceso.spu_ordenes_servicio_consultar($1,$2,$3,$4,$5)";
      ds.connector.execute(sql, [desde,hasta,estado,cliente,sub_cliente], function(err, data) {
          if (err){
            next(err);      
          }   
          next(null, data);
      }); */  
  };

  Orden.remoteMethod('contar', {
    accepts: [
      {
        arg: 'where',
        type: 'object',
        required: false
      },

        {arg: "options", type: "object", 'http': "optionsFromRequest"}
    ],
    returns: {
      arg: 'response',
      type: 'object',
      root: true
    },
    http: {
      verb: 'GET',
      path: '/contar'
    }
  });

  Orden.consultaMultiple = (osOperador,nroOS,estado,operador,cliente,desde,hasta,ordenado_por,desde_fila,limite_filas,options, next) => {
    var ds = Orden.dataSource;
    const valores = options && options.accessToken;
    const token = valores && valores.id;
    const usu_id = valores && valores.userId;
 
     Promise.resolve().then(()=>{
      return new Promise(function(resolve, reject) {
          var sql = "select * from  proceso.spu_os_consultar($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11);";
          ds.connector.execute(sql, [
            osOperador, nroOS, estado, operador, cliente, desde, hasta, ordenado_por,desde_fila,limite_filas,usu_id
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

  Orden.remoteMethod('consultaMultiple', {
    accepts: [        
      {arg: "osOperador", type: "number", required: true },
      {arg: "nroOS", type: "number", required: true },
      {arg: "estado", type: "number", required: true },
      {arg: "operador", type: "number", required: true },
      {arg: "cliente", type: "number", required: true },
      {arg: "desde", type: "string", required: true },
      {arg: "hasta", type: "string", required: true },
      {arg: "ordenado_por", type: "string", required: true },
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

}