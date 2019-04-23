
module.exports = (Empresa) => {

  Empresa.distrito = (next) => {
    var ds = Empresa.dataSource;
    /*page = page || 1;
    limit = limit || 10;

    var skip = (page - 1) * limit;
    */
    var data = {};

    var sql = "select * from general.vista_distrito order by 1";
      ds.connector.execute(sql, [], function(err, data) {
          if (err){
            next(err);      
          }   
          next(null, data);
      });   
  };

  Empresa.remoteMethod('distrito', {
    accepts: [
    ],
    returns: {
      arg: 'response',
      type: 'object',
      root: true
    },
    http: {
      verb: 'GET',
      path: '/distrito'
    }
  });
}