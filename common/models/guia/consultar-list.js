
module.exports = (Guia) => {
    /*Implementación*/
    Guia.consultaMultiple = (fecha_desde,fecha_hasta,gue_id,emp_id_operador,men_id,despachador_id,ordenado_por,desde_fila,limite_filas,options, next) => {
      var ds = Guia.dataSource;
      const valores = options && options.accessToken;
      const token = valores && valores.id;
      const usu_id = valores && valores.userId;
   
       Promise.resolve().then(()=>{
        return new Promise(function(resolve, reject) {
            var sql = "select * from  proceso.spu_guia_consultar_multiple($1,$2,$3,$4,$5,$6,$7,$8,$9,$10);";
            ds.connector.execute(sql, [
              fecha_desde, fecha_hasta, gue_id, emp_id_operador, men_id, despachador_id,ordenado_por,desde_fila,limite_filas,usu_id
            ], function(err, data) {
                if (err){ reject(err); }
                else{ next(null,data); }
            });   
          })
      })
      .catch(function(err){
        console.log(err); next("Ocurrio un error al realizar la búsqueda.");   
      });
    };
    Guia.consultaNumero = (gui_numero,options, next) => {
      var ds = Guia.dataSource;
      const valores = options && options.accessToken;
      const token = valores && valores.id;
      const usu_id = valores && valores.userId;
   
       Promise.resolve().then(()=>{
        return new Promise(function(resolve, reject) {
            var sql = "select * from  proceso.spu_guia_consultar_numero($1,$2);";
            ds.connector.execute(sql, [
              gui_numero,usu_id
            ], function(err, data) {
                if (err){ reject(err); }
                else{ next(null,data); }
            });   
          })
      })
      .catch(function(err){
        console.log(err); next("Ocurrio un error al realizar la búsqueda.");   
      });
    };
    Guia.consultaOrden = (nro_orden_courier,options, next) => {
      var ds = Guia.dataSource;
      const valores = options && options.accessToken;
      const token = valores && valores.id;
      const usu_id = valores && valores.userId;
   
       Promise.resolve().then(()=>{
        return new Promise(function(resolve, reject) {
            var sql = "select * from  proceso.spu_guia_consultar_os($1,$2);";
            ds.connector.execute(sql, [
              nro_orden_courier,usu_id
            ], function(err, data) {
                if (err){ reject(err); }
                else{ next(null,data); }
            });   
          })
      })
      .catch(function(err){
        console.log(err); next("Ocurrio un error al realizar la búsqueda.");   
      });
    };
    Guia.consultaCodigoBarra = (codigo_barra,options, next) => {
      var ds = Guia.dataSource;
      const valores = options && options.accessToken;
      const token = valores && valores.id;
      const usu_id = valores && valores.userId;

      Promise.resolve().then(()=>{
        return new Promise(function(resolve, reject) {
            var sql = "select * from proceso.spu_guia_buscar_por_cb($1,$2);";
            ds.connector.execute(sql, [
              codigo_barra,usu_id
            ], function(err, data) {
                if (err){ reject(err); }
                else{ next(null,data); }
            });   
          })
      })
      .catch(function(err){
        console.log(err); next("Ocurrio un error al realizar la búsqueda.");   
      });
    };
    Guia.consultaDetalle = (gui_id,desde_fila,limite_filas,options, next) => {
      var ds = Guia.dataSource;
      
      Promise.resolve()
      .then(()=>{
        return new Promise(function(resolve, reject) {
            var sql = "select * from  proceso.spu_guia_consultar_detalle($1,$2,$3);";
            ds.connector.execute(sql, [gui_id,desde_fila,limite_filas], 
            function(err, data) {
              if (err){ reject(err); }
              else{ next(null,data); }
            });
        });
      })
      .catch(function(err){
        console.log(err); next("Ocurrio un error al realizar la búsqueda.");   
      });
    };
    Guia.consultaFiltro = (gui_id,emp_id_user,options, next) => {
      var ds = Guia.dataSource;
      
      Promise.resolve()
      .then(()=>{
        return new Promise(function(resolve, reject) {
            var sql = "select * from proceso.spu_guia_consulta_filtro($1,$2);";
            ds.connector.execute(sql, [gui_id,emp_id_user], 
            function(err, data) {
              if (err){ reject(err); }
              else{ next(null,data); }
            });
        });
      })
      .catch(function(err){
        console.log(err); next("Ocurrio un error al realizar la búsqueda.");   
      });
    };
    /*Definición*/
    Guia.remoteMethod('consultaMultiple', {
      accepts: [        
        {arg: "fecha_desde", type: "string", required: true },
        {arg: "fecha_hasta", type: "string", required: true },
        {arg: "gue_id", type: "number", required: true },
        {arg: "emp_id_operador", type: "number", required: true },
        {arg: "men_id", type: "number", required: true },
        {arg: "despachador_id", type: "number", required: true },
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
    Guia.remoteMethod('consultaNumero', {
      accepts: [        
        {arg: "gui_numero", type: "number", required: true },
        {arg: "options", type: "object", 'http': "optionsFromRequest"}
      ],
      returns: {
        arg: 'response',
        type: 'object',
        root: true
      },
      http: {
        verb: 'GET',
        path: '/consultaNumero'
      }
    });
    Guia.remoteMethod('consultaOrden', {
      accepts: [        
        {arg: "nro_orden_courier", type: "number", required: true },
        {arg: "options", type: "object", 'http': "optionsFromRequest"}
      ],
      returns: {
        arg: 'response',
        type: 'object',
        root: true
      },
      http: {
        verb: 'GET',
        path: '/consultaOrden'
      }
    });
    Guia.remoteMethod('consultaCodigoBarra', {
      accepts: [        
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
        path: '/consultaCodigoBarra'
      }
    });
    Guia.remoteMethod('consultaDetalle', {
      accepts: [        
        {arg: "gui_id", type: "number", required: true },
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
        path: '/consultaDetalle'
      }
    });
    Guia.remoteMethod('consultaFiltro', {
      accepts: [        
        {arg: "gui_id", type: "number", required: true },
        {arg: "emp_id_user", type: "number", required: false },
        {arg: "options", type: "object", 'http': "optionsFromRequest"}
      ],
      returns: {
        arg: 'response',
        type: 'object',
        root: true
      },
      http: {
        verb: 'GET',
        path: '/consultaFiltro'
      }
    });
  }