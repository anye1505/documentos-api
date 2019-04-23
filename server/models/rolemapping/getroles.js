module.exports = (Rolemapping) => {

    Rolemapping.getroles = (userid,options, next) => {
      var ds = Rolemapping.dataSource;      
      const valores = options && options.accessToken;
      const userId = valores && valores.userId;  
      console.log("antes del promise");
      Promise.resolve().then(()=>{
        return new Promise(function(resolve, reject) {
            var sql = "select * from seguridad.rolemapping rm join seguridad.role r on rm.roleId = r.id where rm.principalId = $1";
            if(userid){
                var parameters = [userid];
            }else{
                var parameters = [userId];
            }
            
            ds.connector.execute(sql,parameters, function(err, data) {
                if (err){ console.log("err:",err);reject(err); }
                else{ next(null,data); }
            });
          })
      })
      .catch(function(err){
        console.log(err); next("Ocurrio un error al buscar roles.");   
      });
  
    };
  
    Rolemapping.remoteMethod('getroles', {
      accepts: [
        {arg: 'userid', type: 'number', required: false},
        {arg: "options", type: "object", 'http': "optionsFromRequest"}
      ],
      returns: {
        arg: 'response',
        type: 'object',
        root: true
      },
      http: {
        verb: 'POST',
        path: '/getroles'
      }
    });
  
  
  }