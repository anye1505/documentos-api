var fs = require('fs-extra');
var path = require('path');
var uuid = require('uuid');
var Util = require('./util');

module.exports = {
  save: (file, folder) => {
    return new Promise(function (resolve, reject) {
      if (!file) reject(Util.error({msg: 'File not found'}));

      var filename = uuid.v1() + file.name.substring(file.name.lastIndexOf('.'));
      var relativePath = folder + '/' + filename;
      var destPath = path.join(__dirname, "..", 'storage', relativePath);

      fs.copy(file.path, destPath, (err) => {
        console.log(err);
        if (err) reject(Util.error({msg: 'File not saved'}));
        resolve(relativePath);
      });
    });
  },
  replace: (file, relativePath) => {
    return new Promise(function (resolve, reject) {
      if (!file) reject(Util.error({msg: 'File not found'}));

      fs.copy(file.path, path.join(__dirname, "..", 'storage', relativePath), (err) => {
        if (err) reject(Util.error({msg: 'File not saved'}));
        resolve();
      });
    });
  },
  delete: (relativePath) => {
    return new Promise(function (resolve, reject) {
      fs.unlink(path.join(__dirname, "..", 'storage', relativePath), (err) => {
        if (err) return reject(Util.error({msg: 'File not deleted'}));
        resolve();
      });
    });
  }
};
