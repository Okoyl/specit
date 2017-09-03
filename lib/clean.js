var rimraf = require('rimraf');

var files = require('./files');

module.exports = function (root, pkg) {
  var serviceFilePath = files.serviceFile(root, pkg);
  var specsDirectory = files.specsDirectory(root);
  var sourcesDirectory = files.sourcesDirectory(root);

  // rimraf.sync(serviceFilePath);
  rimraf.sync(specsDirectory);
  rimraf.sync(sourcesDirectory);
};
