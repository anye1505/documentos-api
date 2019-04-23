module.exports = function(GuiaDespacho) {
    require('./guia-despacho/consultar-list')(GuiaDespacho);
    require('./guia-despacho/guia-crud')(GuiaDespacho);
    require('./guia-despacho/reporte-list')(GuiaDespacho);
};