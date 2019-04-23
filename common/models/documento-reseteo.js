module.exports = function(DocumentoReseteo) {
    require('./documento-reseteo/consulta-list')(DocumentoReseteo);
    require('./documento-reseteo/crud')(DocumentoReseteo);
};