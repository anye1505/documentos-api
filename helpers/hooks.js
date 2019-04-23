var formidable = require('formidable');


module.exports = {
  beforeRemoteFormData: (ctx, unused, next) => {
    var parsedFields, parsedFiles;
    var form = new formidable.IncomingForm();
    form.maxFileSize=80 * 1024 * 1024;
    form.parse(ctx.req, (err, fields, files) => {
      if (err) return next(err);
      parsedFields = fields;
      parsedFiles = files;
    });

    form.on('end', () => {
      for (let i in parsedFiles) {
        ctx.req.remotingContext.args[i] = parsedFiles[i];
      }
      for (let i in parsedFields) {
        try {
          var obj = JSON.parse(parsedFields[i]);
          if (typeof obj === "object" && obj !== null)
            ctx.req.remotingContext.args[i] = obj;
          else
            ctx.req.remotingContext.args[i] = parsedFields[i];
        } catch (e) {
          ctx.req.remotingContext.args[i] = parsedFields[i];
        }
      }
      return next();
    });

    form.on('error', next);
  }
};
