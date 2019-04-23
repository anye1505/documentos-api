
module.exports = (Empresa) => {

  Empresa.cliente = (emp_id_operador,emp_id_courier,next) => {
    var ds = Empresa.dataSource;
    var data = {};
    if(emp_id_operador && emp_id_courier){ //This is for clients module, client dropdown
      var sql = "select * from general.vista_cliente where emp_id_operador=$1 and emp_id_courier=$2 order by emp_abrev";
      ds.connector.execute(sql, [emp_id_operador,emp_id_courier], function(err, data) {
        if (err){
          next(err);      
        }console.log("data:",data);   
        next(null, data);
      });
    }else{
      var sql = "select * from general.vista_cliente order by emp_abrev";
      ds.connector.execute(sql, [], function(err, data) {
          if (err){
            next(err);      
          }   
          next(null, data);
      });
    }       
  };

  Empresa.remoteMethod('cliente', {
    accepts: [
      {arg: 'emp_id_operador', type: 'number', required: false},
      {arg: 'emp_id_courier', type: 'number', required: false}
    ],
    returns: {
      arg: 'response',
      type: 'object',
      root: true
    },
    http: {
      verb: 'GET',
      path: '/cliente'
    }
  });
}