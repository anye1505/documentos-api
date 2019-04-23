
module.exports = function(Empresa) {	

  	require('./empresa/operador-list')(Empresa);
	  require('./empresa/cliente-list')(Empresa);
	  require('./empresa/courier-list')(Empresa);
  	require('./empresa/distrito-list')(Empresa);
	require('./empresa/formato-list')(Empresa);
	require('./empresa/mensajero-list')(Empresa);
};
