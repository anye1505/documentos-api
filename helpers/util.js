module.exports = {
  error: function (opts) {
    var error = new Error();
    error.message = ('msg' in opts) ? opts.msg : 'An error has ocurred';
    error.status = ('status' in opts) ? opts.status : 500;
    error.name = ('name' in opts) ? opts.name : 'Error';
    return error;
  }
};
