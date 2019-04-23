module.exports = function(Guia) {
    require('./guia/consultar-list')(Guia);
    require('./guia/guia-crud')(Guia);
    require('./guia/reporte-list')(Guia);
};