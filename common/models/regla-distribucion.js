module.exports = function(ReglaDistribucion) {
  	require('./regla-distribucion/crear')(ReglaDistribucion);
  	require('./regla-distribucion/actualizar')(ReglaDistribucion);
  	require('./regla-distribucion/eliminar')(ReglaDistribucion);
};
