let fs = require('fs');
let uuid = require('uuid');
let path = require('path');
const async = require('async');
let Hooks = require('../../../helpers/hooks');
let Files = require('../../../helpers/files');
const { promisify } = require('util');
const moment 	= require('moment');
var { exec } = require('child_process');

module.exports = (Gestion) => {

    Gestion.validarcodigobarra = (codigos,options, next) => {
        var ds = Gestion.dataSource;
        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "SELECT * from proceso.spu_validar_codigo_barra_url_imagen($1);";
                ds.connector.execute(sql,[codigos], async (err, data) => {
                    if (err){ reject(err); }
                    else{ 
                        next(null,data); 
                    }
                });   
            })
        })
        .catch(function(err){
            console.log(err);   
        });
    };

    Gestion.actualizarurlimagen = (codigos,options, next) => {
        var ds = Gestion.dataSource;
        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "SELECT * from proceso.spu_actualizar_url_imagen($1);";
                ds.connector.execute(sql,[codigos], async (err, data) => {
                    if (err){ reject(err); }
                    else{ 
                        next(null,data); 
                    }
                });   
            })
        })
        .catch(function(err){
            console.log(err);   
        });
    };

    Gestion.listagestiones = ( options, next) => {
        var ds = Gestion.dataSource;
        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select ges_id,ges_nombre from proceso.gestion  where tig_id in (4,5) order by 1;";
                ds.connector.execute(sql, async (err, data) => {
                    if (err){ reject(err); }
                    else{ 
                        next(null,data); 
                    }
                });   
            })
        })
        .catch(function(err){
            console.log(err);   
        });
    };
    
  
    Gestion.remoteMethod('validarcodigobarra', {
        accepts: [        
            {arg: "codigos", type: "string", required: true },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
        arg: 'response',
        type: 'object',
        root: true
        },
        http: {
        verb: 'POST',
        path: '/desktop/validar-codigo-barra'
        }
    });

    Gestion.remoteMethod('actualizarurlimagen', {
        accepts: [        
            {arg: "codigos", type: "string", required: true },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
        arg: 'response',
        type: 'object',
        root: true
        },
        http: {
        verb: 'POST',
        path: '/desktop/actualizar-url-imagen'
        }
    });

    Gestion.remoteMethod('listagestiones', {
        accepts: [
          {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
          arg: 'response',
          type: 'object',
          root: true
        },
        http: {
          verb: 'GET',
          path: '/desktop/lista-gestiones'
        }
    });
};