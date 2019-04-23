
module.exports = (GuiaDespacho) => {
    /*Implementación*/
    GuiaDespacho.consultaMultiple = (fecha_desde,fecha_hasta,gde_id,emp_id_operador,suc_id,transportista_id,ordenado_por,desde_fila,limite_filas,options, next) => {
      var ds = GuiaDespacho.dataSource;
      const valores = options && options.accessToken;
      const token = valores && valores.id;
      const usu_id = valores && valores.userId;
   
       Promise.resolve().then(()=>{
        return new Promise(function(resolve, reject) {
            var sql = "select * from  proceso.spu_guia_despacho_consultar_multiple($1,$2,$3,$4,$5,$6,$7,$8,$9,$10);";
            ds.connector.execute(sql, [
              fecha_desde, fecha_hasta, gde_id, emp_id_operador, suc_id, transportista_id,ordenado_por,desde_fila,limite_filas,usu_id
            ], function(err, data) {
                if (err){ reject(err); }
                else{ next(null,data); }
            });   
          })
      })
      .catch(function(err){
        console.log(err); next("Ocurrio un error al cargar Transportista.");   
      });
    };
    GuiaDespacho.consultaNumero = (gud_numero,options, next) => {
      var ds = GuiaDespacho.dataSource;
      const valores = options && options.accessToken;
      const token = valores && valores.id;
      const usu_id = valores && valores.userId;
   
       Promise.resolve().then(()=>{
        return new Promise(function(resolve, reject) {
            var sql = "select * from  proceso.spu_guia_despacho_consultar_numero($1,$2);";
            ds.connector.execute(sql, [
              gud_numero,usu_id
            ], function(err, data) {
                if (err){ reject(err); }
                else{ next(null,data); }
            });   
          })
      })
      .catch(function(err){
        console.log(err); next("Ocurrio un error al cargar Transportista.");   
      });
    };
    GuiaDespacho.consultaOrden = (nro_orden_courier,options, next) => {
      var ds = GuiaDespacho.dataSource;
      const valores = options && options.accessToken;
      const token = valores && valores.id;
      const usu_id = valores && valores.userId;
   
       Promise.resolve().then(()=>{
        return new Promise(function(resolve, reject) {
            var sql = "select * from  proceso.spu_guia_despacho_consultar_os($1,$2);";
            ds.connector.execute(sql, [
              nro_orden_courier,usu_id
            ], function(err, data) {
                if (err){ reject(err); }
                else{ next(null,data); }
            });   
          })
      })
      .catch(function(err){
        console.log(err); next("Ocurrio un error al cargar Transportista.");   
      });
    };
    GuiaDespacho.consultaCodigoBarra = (codigo_barra,options, next) => {
      var ds = GuiaDespacho.dataSource;
      const valores = options && options.accessToken;
      const token = valores && valores.id;
      const usu_id = valores && valores.userId;

      Promise.resolve().then(()=>{
        return new Promise(function(resolve, reject) {
            var sql = "select * from proceso.spu_guia_despacho_buscar_por_cb($1,$2);";
            ds.connector.execute(sql, [
              codigo_barra,usu_id
            ], function(err, data) {
                if (err){ reject(err); }
                else{ next(null,data); }
            });   
          })
      })
      .catch(function(err){
        console.log(err); next("Ocurrio un error al cargar Transportista.");   
      });
    };
    GuiaDespacho.consultaDetalle = (gud_id,desde_fila,limite_filas,options, next) => {
      var ds = GuiaDespacho.dataSource;
      
      Promise.resolve()
      .then(()=>{
        return new Promise(function(resolve, reject) {
            var sql = "select * from  proceso.spu_guia_despacho_consultar_detalle($1,$2,$3);";
            ds.connector.execute(sql, [gud_id,desde_fila,limite_filas], 
            function(err, data) {
              if (err){ reject(err); }
              else{ next(null,data); }
            });
        });
      })
      .catch(function(err){
        console.log(err); next("Ocurrio un error al cargar Transportista.");   
      });
    };
    GuiaDespacho.consultaMultipleRecep = (fecha_desde,fecha_hasta,gde_id,emp_id_operador,suc_id,transportista_id,ordenado_por,desde_fila,limite_filas,options, next) => {
      var ds = GuiaDespacho.dataSource;
      const valores = options && options.accessToken;
      const token = valores && valores.id;
      const usu_id = valores && valores.userId;
   
       Promise.resolve().then(()=>{
        return new Promise(function(resolve, reject) {
            var sql = "select * from  proceso.spu_guia_recepcion_consultar_multiple($1,$2,$3,$4,$5,$6,$7,$8,$9,$10);";
            ds.connector.execute(sql, [
              fecha_desde, fecha_hasta, gde_id, emp_id_operador, suc_id, transportista_id,ordenado_por,desde_fila,limite_filas,usu_id
            ], function(err, data) {
                if (err){ reject(err); }
                else{ next(null,data); }
            });   
          })
      })
      .catch(function(err){
        console.log(err); next("Ocurrio un error al cargar Transportista.");   
      });
    };
    GuiaDespacho.consultaNumeroRecep = (gud_numero,suc_id,options, next) => {
      var ds = GuiaDespacho.dataSource;
      const valores = options && options.accessToken;
      const token = valores && valores.id;
      const usu_id = valores && valores.userId;
   
       Promise.resolve().then(()=>{
        return new Promise(function(resolve, reject) {
            var sql = "select * from  proceso.spu_guia_recepcion_consultar_numero($1,$2,$3);";
            ds.connector.execute(sql, [
              gud_numero,suc_id,usu_id
            ], function(err, data) {
                if (err){ reject(err); }
                else{console.log("data: ",data); next(null,data); }
            });   
          })
      })
      .catch(function(err){
        console.log(err); next("Ocurrio un error al cargar Transportista.");   
      });
    };
    GuiaDespacho.consultaOrdenRecep = (nro_orden_courier,suc_id,options, next) => {
      var ds = GuiaDespacho.dataSource;
      const valores = options && options.accessToken;
      const token = valores && valores.id;
      const usu_id = valores && valores.userId;
   
       Promise.resolve().then(()=>{
        return new Promise(function(resolve, reject) {console.log("datos: ",nro_orden_courier,suc_id,usu_id);
            var sql = "select * from  proceso.spu_guia_recepcion_consultar_os($1,$2,$3);";
            ds.connector.execute(sql, [
              nro_orden_courier,suc_id,usu_id
            ], function(err, data) {
                if (err){ reject(err); }
                else{ console.log("data OS: ",data);next(null,data); }
            });   
          })
      })
      .catch(function(err){
        console.log(err); next("Ocurrio un error al cargar Transportista.");   
      });
    };
    GuiaDespacho.consultaCodigoBarraRecep = (codigo_barra,options, next) => {
      var ds = GuiaDespacho.dataSource;
      const valores = options && options.accessToken;
      const token = valores && valores.id;
      const usu_id = valores && valores.userId;

      Promise.resolve().then(()=>{
        return new Promise(function(resolve, reject) {
            var sql = "select * from proceso.spu_guia_despacho_buscar_por_cb($1,$2);";
            ds.connector.execute(sql, [
              codigo_barra,usu_id
            ], function(err, data) {
                if (err){ reject(err); }
                else{ next(null,data); }
            });   
          })
      })
      .catch(function(err){
        console.log(err); next("Ocurrio un error al cargar Transportista.");   
      });
    };
    GuiaDespacho.consultaDetalleRecep = (gud_id,desde_fila,limite_filas,options, next) => {
      var ds = GuiaDespacho.dataSource;
      
      Promise.resolve()
      .then(()=>{
        return new Promise(function(resolve, reject) {
            var sql = "select * from  proceso.spu_guia_despacho_consultar_detalle($1,$2,$3);";
            ds.connector.execute(sql, [gud_id,desde_fila,limite_filas], 
            function(err, data) {
              if (err){ reject(err); }
              else{ next(null,data); }
            });
        });
      })
      .catch(function(err){
        console.log(err); next("Ocurrio un error al cargar Transportista.");   
      });
    };
    GuiaDespacho.consultaFiltro = (gui_id,options, next) => {
      var ds = GuiaDespacho.dataSource;
      
      Promise.resolve()
      .then(()=>{
        return new Promise(function(resolve, reject) {
            var sql = "select * from proceso.spu_guia_despacho_consulta_filtro($1);";
            ds.connector.execute(sql, [gui_id], 
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
    GuiaDespacho.remoteMethod('consultaMultiple', {
      accepts: [        
        {arg: "fecha_desde", type: "string", required: true },
        {arg: "fecha_hasta", type: "string", required: true },
        {arg: "gde_id", type: "number", required: true },
        {arg: "emp_id_operador", type: "number", required: true },
        {arg: "suc_id", type: "number", required: true },
        {arg: "transportista_id", type: "number", required: true },
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
    GuiaDespacho.remoteMethod('consultaNumero', {
      accepts: [        
        {arg: "gud_numero", type: "number", required: true },
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
    GuiaDespacho.remoteMethod('consultaOrden', {
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
    GuiaDespacho.remoteMethod('consultaCodigoBarra', {
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
    GuiaDespacho.remoteMethod('consultaDetalle', {
      accepts: [        
        {arg: "gud_id", type: "number", required: true },
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
    GuiaDespacho.remoteMethod('consultaMultipleRecep', {
      accepts: [        
        {arg: "fecha_desde", type: "string", required: true },
        {arg: "fecha_hasta", type: "string", required: true },
        {arg: "gde_id", type: "number", required: true },
        {arg: "emp_id_operador", type: "number", required: true },
        {arg: "suc_id", type: "number", required: true },
        {arg: "transportista_id", type: "number", required: true },
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
        path: '/consultaMultipleRecep'
      }
    });
    GuiaDespacho.remoteMethod('consultaNumeroRecep', {
      accepts: [        
        {arg: "gud_numero", type: "string", required: true },
        {arg: "suc_id", type: "number", required: true },
        {arg: "options", type: "object", 'http': "optionsFromRequest"}
      ],
      returns: {
        arg: 'response',
        type: 'object',
        root: true
      },
      http: {
        verb: 'GET',
        path: '/consultaNumeroRecep'
      }
    });
    GuiaDespacho.remoteMethod('consultaOrdenRecep', {
      accepts: [        
        {arg: "nro_orden_courier", type: "number", required: true },
        {arg: "suc_id", type: "number", required: true },
        {arg: "options", type: "object", 'http': "optionsFromRequest"}
      ],
      returns: {
        arg: 'response',
        type: 'object',
        root: true
      },
      http: {
        verb: 'GET',
        path: '/consultaOrdenRecep'
      }
    });
    GuiaDespacho.remoteMethod('consultaCodigoBarraRecep', {
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
        path: '/consultaCodigoBarraRecep'
      }
    });
    GuiaDespacho.remoteMethod('consultaDetalleRecep', {
      accepts: [        
        {arg: "gud_id", type: "number", required: true },
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
        path: '/consultaDetalleRecep'
      }
    });
    GuiaDespacho.remoteMethod('consultaFiltro', {
      accepts: [        
        {arg: "gui_id", type: "number", required: true },
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