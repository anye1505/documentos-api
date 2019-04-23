
module.exports = (Empresa) => {
    Empresa.mensajero = (emp_id,options,next) => {
      var ds = Empresa.dataSource;
      /*page = page || 1;
      limit = limit || 10;
      var skip = (page - 1) * limit;
      */
      const valores = options && options.accessToken;
      const token = valores && valores.id;
      const userId = valores && valores.userId;
      Promise.resolve()
      .then(()=> {
        return new Promise(function(resolve, reject) {
            Empresa.app.models.user.findById(
              userId,{},
              (err,data)=>{
                if(err){         
                  reject(err);
                }else{
                  if(!data){
                    reject("No se encontraron mensajeros para ud.");
                  }else{      
                    //resolve(data.emp_id); 
                    resolve(data);
                  }
                }
              }
            )
        })
      })
      //.then((emp_id)=>{
      .then(function(us){
        return new Promise(function(resolve, reject) {
          var sql = "select * from general.vista_mensajero where emp_id_courier=$1 and suc_id=$2 and men_activo=true  order by men_nombre asc";
          ds.connector.execute(sql, [us.emp_id, us.suc_id], function(err, data) {
              if (err){ reject(err); }
              else{ next(null,data); }
          });   
        })
      })
      .catch(function(err){ console.log(err); next("Ocurrio un error al cargar mensajeros."); });
    };
    Empresa.mensajeroid = (men_id,options,next) => {
      var ds = Empresa.dataSource;
      const valores = options && options.accessToken;
      const userId = valores && valores.userId;
      Promise.resolve()
      .then(()=> {
        return new Promise(function(resolve, reject) {
            Empresa.app.models.user.findById(
              userId,{},
              (err,data)=>{
                if(err){         
                  reject(err);
                }else{
                  if(!data){
                    reject("No se encontraron mensajeros para ud.");
                  }else{
                    resolve(data);
                  }
                }
              }
            )
        })
      })
      .then(function(us){
        return new Promise(function(resolve, reject) {
          var sql = "select * from general.vista_mensajero where emp_id_courier=$1 and suc_id=$2 and men_id=$3";
          ds.connector.execute(sql, [us.emp_id, us.suc_id, men_id], function(err, data) {
              if (err){ reject(err); }
              else{ next(null,data); }
          });   
        })
      })
      .catch(function(err){ console.log(err); next("Ocurrio un error al cargar mensajeros."); });
    };
  
    Empresa.remoteMethod('mensajero', {
      accepts: [
        { arg: 'emp_id', type: 'number', required: false },
        { arg: "options", type: "object", 'http': "optionsFromRequest"}
      ],
      returns: {
        arg: 'response',
        type: 'object',
        root: true
      },
      http: {
        verb: 'GET',
        path: '/mensajero'
      }
    });

    Empresa.remoteMethod('mensajeroid', {
      accepts: [
        { arg: 'men_id', type: 'number', required: false },
        { arg: "options", type: "object", 'http': "optionsFromRequest"}
      ],
      returns: {
        arg: 'response',
        type: 'object',
        root: true
      },
      http: {
        verb: 'GET',
        path: '/mensajeroid'
      }
    });
  }