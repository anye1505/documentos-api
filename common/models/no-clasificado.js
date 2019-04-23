module.exports = function(NoClasificado) {
    require('./no-clasificado/consultar')(NoClasificado);
    require('./no-clasificado/clasificado-crud')(NoClasificado);
};