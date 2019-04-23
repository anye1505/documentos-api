module.exports = function(Sucursal) {
	  require('./sucursal/buscar')(Sucursal);
	  require('./sucursal/despachador-list')(Sucursal);
	  require('./sucursal/sucursales-list')(Sucursal);
	  require('./sucursal/distrito-list')(Sucursal);
	  require('./sucursal/cuadrante-list')(Sucursal);
	  require('./sucursal/transportista-list')(Sucursal);
};
