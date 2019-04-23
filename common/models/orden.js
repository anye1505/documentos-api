'use strict';

var fs = require('fs-extra');
var uuid = require('uuid');
var path = require('path');

var Hooks = require('../../helpers/hooks');
var Files = require('../../helpers/files');
//var Files = require('../../../helpers/files');

module.exports = function(orden) {
  	require('./orden/consultar')(orden);
  	require('./orden/consumo')(orden);
    require('./orden/upload')(orden);
    require('./orden/uploadBase')(orden);
    require('./orden/generarOP')(orden);
    require('./orden/generarEtiqueta')(orden);
    require('./orden/enotriaWs')(orden);
    require('./orden/generarOPapido')(orden);
    require('./orden/recepcionArchivo')(orden);
    require('./orden/basePrioritario')(orden);
    require('./orden/eliminar')(orden);
    require('./orden/reporte-list')(orden);
};
