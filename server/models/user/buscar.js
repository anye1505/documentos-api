module.exports = (User) => {

    User.buscar = (emp_id,nombre,options, next) => {
      var ds = User.dataSource;
      
      const valores = options && options.accessToken;
      const token = valores && valores.id;
      const userId = valores && valores.userId;  
  
      Promise.resolve().then(()=>{
        return new Promise(function(resolve, reject) {console.log("nombre:",nombre);
            if(emp_id==0){
                var sql = "select * from seguridad.user where name ilike $1 or username ilike $2 or surname ilike $3 or email ilike $4";
                //console.log("sql:",sql);
                ds.connector.execute(sql,['%'+nombre+'%','%'+nombre+'%','%'+nombre+'%','%'+nombre+'%'], function(err, data) {
                    if (err){ reject(err); }
                    else{ console.log("user:",data);next(null,data); }
                });
            } else{
                var sql = "select * from seguridad.user where name ilike $1 or username ilike $2 or surname ilike $3 or email ilike $4 and emp_id = $5";
                //console.log("sql:",sql);
                ds.connector.execute(sql,['%'+nombre+'%','%'+nombre+'%','%'+nombre+'%','%'+nombre+'%',emp_id], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });
            }
          })
      })
      .catch(function(err){
        console.log(err); next("Ocurrio un error al buscar usuario.");   
      });
  
    };
  
    User.remoteMethod('buscar', {
      accepts: [
        {arg: "emp_id", type: "number", required: false },
        {arg: "nombre", type: "string", required: true },
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