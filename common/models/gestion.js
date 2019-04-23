module.exports = function(Gestion) {
    require('./gestion/consultar-list')(Gestion);
    require('./gestion/descarga-crud')(Gestion);
    require('./gestion/reporte')(Gestion);
    require('./gestion/desktop')(Gestion);
    require('./gestion/cliente')(Gestion);
};