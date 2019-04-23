module.exports = (Sucursal) => {
    Sucursal.distritos = (suc_id, options, next) => {
      var ds = Sucursal.dataSource;
      
      /*const valores = options && options.accessToken;
      const token = valores && valores.id;
      const userId = valores && valores.userId;*/
   
      Promise.resolve()
        /*.then(()=> {
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
      })*/
      .then(()=>{
        return new Promise(function(resolve, reject) {
            var sql = "select sa.sam_id ,u.ubi_nom_departamento || '-' ||u.ubi_nom_provincia || '-' ||u.ubi_nom_distrito distrito_nombre ";
            sql = sql + " from general.sucursal_ambito sa inner join geo.ubigeo u on sa.ubi_id_distrito=u.ubi_id_distrito  inner join general.sucursal s ";
            sql = sql + " on sa.suc_id=s.suc_id  where s.suc_id=$1 order by u.ubi_id_distrito ";
            ds.connector.execute(sql, [suc_id], function(err, data) {
                if (err){ reject(err); } else{ next(null,data); }
            });  
        });
      })
      .catch(function(err){ console.log(err); next("Ocurrio un error al cargar formatos.");   
      });
  
    };
  
    Sucursal.remoteMethod('distritos', {
      accepts: [
        {arg: 'suc_id', type: 'number', required: true},
        {arg: "options", type: "object", 'http': "optionsFromRequest"}
      ],
      returns: {
        arg: 'response',
        type: 'object',
        root: true
      },
      http: {
        verb: 'GET',
        path: '/distritos'
      }
    });
}