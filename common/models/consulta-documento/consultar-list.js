let Hooks = require('../../../helpers/hooks');
let fs = require('fs');
let uuid = require('uuid');
let path = require('path');
const async = require('async');
let Files = require('../../../helpers/files');

module.exports = (ConsultaDocumento) => {
    /*Implementación*/
    ConsultaDocumento.beforeRemote('buscar_archivo', Hooks.beforeRemoteFormData);


    ConsultaDocumento.buscar = (cod_barra, tipo_reg, suc, options, next) => {
      var ds = ConsultaDocumento.dataSource;
      const valores = options && options.accessToken;
      const token = valores && valores.id;
      const usu_id = valores && valores.userId;
   
       Promise.resolve().then(()=>{
        return new Promise(function(resolve, reject) {
            var sql = "select * from proceso.spu_documento_consultar($1,$2,$3,$4)";
            ds.connector.execute(sql, [cod_barra,tipo_reg,suc,usu_id], function(err, data) {
                if (err){ reject(err); }
                else{ next(null,data); }
            });   
          })
      })
      .catch(function(err){
        console.log(err); next("Ocurrio un error al realizar la consulta.");   
      });
    };
    ConsultaDocumento.detalle = (doc_id, tipo_reg,ord_id, options, next) => {
        var ds = ConsultaDocumento.dataSource;
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const usu_id = valores && valores.userId;
     
         Promise.resolve().then(()=>{
          return new Promise(function(resolve, reject) {
              var sql = "select * from proceso.spu_documento_detalle_consultar_lineatiempo($1,$2,$3)";
              ds.connector.execute(sql, [doc_id,tipo_reg,ord_id], function(err, data) {
                  if (err){ reject(err); }
                  else{ next(null,data); }
              });   
            })
        })
        .catch(function(err){
          console.log(err); next("Ocurrio un error al realizar la consulta.");   
        });
      };
    

    ConsultaDocumento.buscar_archivo = (file, tipo_reg, options, next) => {
        var ds = ConsultaDocumento.dataSource;
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const usu_id = valores && valores.userId;
        let desFileName = ''; 
        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                let filename = file.name;
                desFileName = uuid.v1()+"_"+filename;
                let destPath = path.join("/mnt/nfs/descarga_gestion/", desFileName);
                console.log(destPath);       
				fs.copyFile(file.path, destPath, (err) => {
					if (err) {console.log("No se pudo copiar el archivo");
						reject(err);
					}else{
						var sql = "select * from proceso.spu_documento_consultar_archivo($1,$2)";
                        ds.connector.execute(sql, [desFileName,parseInt(tipo_reg)], function(err, data) {
                            if (err){console.log("error:",err); reject(err); }
                            else{next(null,data); }
                        });   
					}
                });
            })
        })
        .catch(function(err){
            console.log(err); next("Ocurrio un error al realizar la consulta.");   
        });
        
    };
    ConsultaDocumento.porDestinatario = (emp_id, codigo, tipo_reg, courier, suc, cli_id, options, next) => {
        console.log("codigo:", typeof codigo);
        var ds = ConsultaDocumento.dataSource;
        const valores = options && options.accessToken;
        const usu_id = valores && valores.userId;
     
         Promise.resolve().then(()=>{
          return new Promise(function(resolve, reject) {
              var sql = "select * from proceso.spu_documento_consultar_codinterno2($1,$2,$3,$4,$5,$6,$7)";
              ds.connector.execute(sql, [emp_id,codigo,tipo_reg,courier,suc,usu_id,cli_id], function(err, data) {
                  if (err){ reject(err); }
                  else{ next(null,data); }
              });   
            })
        })
        .catch(function(err){
          console.log(err); next("Ocurrio un error al realizar la consulta.");   
        });
      };
    ConsultaDocumento.buscarbasico = (cod_barra, tipo_reg, suc, options, next) => {
      var ds = ConsultaDocumento.dataSource;
      const valores = options && options.accessToken;
      const token = valores && valores.id;
      const usu_id = valores && valores.userId;
   
       Promise.resolve().then(()=>{
        return new Promise(function(resolve, reject) {
            var sql = "select * from proceso.spu_documento_consulta_basica($1,$2,$3,$4)";
            ds.connector.execute(sql, [cod_barra,tipo_reg,suc,usu_id], function(err, data) {
                if (err){ reject(err); }
                else{ next(null,data); }
            });   
          })
      })
      .catch(function(err){
        console.log(err); next("Ocurrio un error al realizar la consulta.");   
      });
    };
    ConsultaDocumento.remoteMethod('buscar', {
        accepts: [
            {arg: "cod_barra", type: "string", required: true },
            {arg: "tipo_reg", type: "number", required: true },  
            {arg: "suc", type: "number", required: true },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
            arg: 'response',
            type: 'object',
            root: true
        },
        http: {
            verb: 'POST',
            path: '/buscar'
        }
    });
    ConsultaDocumento.remoteMethod('detalle', {
        accepts: [
            {arg: "doc_id", type: "number", required: true },
            {arg: "tipo_reg", type: "number", required: true },
            {arg: "ord_id", type: "number", required: true },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
            arg: 'response',
            type: 'object',
            root: true
        },
        http: {
            verb: 'GET',
            path: '/detalle'
        }
    });
    ConsultaDocumento.remoteMethod('buscar_archivo', {
        accepts: [
            {arg: "file", type: "object", required: true },
            {arg: "tipo_reg", type: "string", required: true },  
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
            arg: 'response',
            type: 'object',
            root: true
        },
        http: {
            verb: 'POST',
            path: '/buscar_archivo'
        }
    });
    ConsultaDocumento.remoteMethod('porDestinatario', {
        accepts: [
            {arg: "emp_id", type: "number", required: true },
            {arg: "codigo", type: "string", required: true },
            {arg: "tipo_reg", type: "number", required: true },
            {arg: "courier", type: "number", required: true },
            {arg: "suc", type: "number", required: true },
            {arg: "cli_id", type: "number", required: true },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
            arg: 'response',
            type: 'object',
            root: true
        },
        http: {
            verb: 'GET',
            path: '/porDestinatario'
        }
    });
    ConsultaDocumento.remoteMethod('buscarbasico', {
        accepts: [
            {arg: "cod_barra", type: "string", required: true },
            {arg: "tipo_reg", type: "number", required: true },  
            {arg: "suc", type: "number", required: true },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
            arg: 'response',
            type: 'object',
            root: true
        },
        http: {
            verb: 'GET',
            path: '/buscar_basico'
        }
    });
};