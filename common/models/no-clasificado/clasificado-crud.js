let fs = require('fs');
let uuid = require('uuid');
let path = require('path');
let Hooks = require('../../../helpers/hooks');
let Files = require('../../../helpers/files');

module.exports = (NoClasificado) => {
    NoClasificado.consultarCodigoBarra = (cod_barra,options, next) => {
        var ds = NoClasificado.dataSource;
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const usu_id = valores && valores.userId;

        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select * from proceso.spu_clasificacion_consultar_cb($1,$2);";
                ds.connector.execute(sql, [cod_barra,usu_id], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });   
            })
        })
        .catch(function(err){
            console.log(err); next("Ocurrio un error al buscar el docuemnto");   
        });
    };
    NoClasificado.grabarCabecera = (cla_id, cla_motivo,options, next) => {
        var ds = NoClasificado.dataSource;
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const usu_id = valores && valores.userId;

        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                var sql = "select * from proceso.spu_clasificacion_actualizar($1,$2,$3);";
                ds.connector.execute(sql, [cla_id,cla_motivo,usu_id], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });   
            })
        })
        .catch(function(err){
            console.log(err); next("Ocurrio un error al asignar el/los documento/s a la guia.");   
        });
    };
    NoClasificado.grabarDetalle = (cla_id, cod_barra, distrito, options, next) => {
        var ds = NoClasificado.dataSource;
        const valores = options && options.accessToken;
        const token = valores && valores.id;
        const usu_id = valores && valores.userId;

        Promise.resolve().then(()=>{
            return new Promise(function(resolve, reject) {
                console.log("datos: ",cla_id,usu_id,cod_barra,distrito);
                var sql = "select * from proceso.spu_clasificacion_detalle_actualizar($1,$2,$3,$4);";
                ds.connector.execute(sql, [cla_id,usu_id,cod_barra,distrito], function(err, data) {
                    if (err){ reject(err); }
                    else{ next(null,data); }
                });   
            })
        })
        .catch(function(err){
            console.log(err); next("Ocurrio un error al asignar el/los documento/s a la guia.");   
        });
    };
    NoClasificado.remoteMethod('consultarCodigoBarra', {
        accepts: [
            {arg: "cod_barra", type: "string", required: true },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
            arg: 'response',
            type: 'object',
            root: true
        },
        http: {
            verb: 'GET',
            path: '/consultarCodigoBarra'
        }
    });
    NoClasificado.remoteMethod('grabarCabecera', {
        accepts: [
            {arg: "cla_id", type: "number", required: true },
            {arg: "cla_motivo", type: "string", required: true },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
            arg: 'response',
            type: 'object',
            root: true
        },
        http: {
            verb: 'GET',
            path: '/grabarCabecera'
        }
    });
    NoClasificado.remoteMethod('grabarDetalle', {
        accepts: [
            {arg: "cla_id", type: "number", required: true },
            {arg: "cod_barra", type: "string", required: true },
            {arg: "distrito", type: "number", required: true },
            {arg: "options", type: "object", 'http': "optionsFromRequest"}
        ],
        returns: {
            arg: 'response',
            type: 'object',
            root: true
        },
        http: {
            verb: 'GET',
            path: '/grabarDetalle'
        }
    });
}