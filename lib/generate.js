var _ = require('lodash');
var fs = require('fs');
var path = require('path');

var archiver = require('./archiver');
var createServiceFile = require('./service');
var createSpecFile = require('./spec');
var files = require('./files');

function generateServiceFile(root, pkg) {
  var serviceFileContents = createServiceFile(pkg);
  var serviceFilePath = files.serviceFile(root, pkg);

  fs.writeFileSync(serviceFilePath, serviceFileContents);

  return serviceFilePath;
}

function generateSpecFile(root, specdir, pkg, release) {
  var specFileContents = createSpecFile(root, pkg, release);
  var specFilePath = files.specFile(specdir, pkg);

  fs.writeFileSync(specFilePath, specFileContents);

  return specFilePath;
}

function addCustomFieldsToPackage(pkg, customName) {
  if (customName) {
    return _.extend({}, pkg, { name: customName });
  }

  return pkg;
}

function relativeToRoot(root, files) {
  return files.map(function (file) {
    return path.relative(root, file);
  });
}

module.exports = function (root, pkg, release, customName, cb) {
  var customPackage = addCustomFieldsToPackage(pkg, customName);
  var specsDirectory = files.specsDirectory(root);
  var sourcesDirectory = files.sourcesDirectory(root);
  var sourcesArchive = files.sourcesArchive(root, customPackage);

  fs.mkdirSync(specsDirectory);
  fs.mkdirSync(sourcesDirectory);
  var serviceFile = generateServiceFile(root, customPackage);
  var specFile = generateSpecFile(root, specsDirectory, customPackage, release);

  archiver.compress(root, sourcesArchive, function (err) {
    if (err) {
      return cb(err);
    }

    cb(null, relativeToRoot(root, [
      specFile,
      sourcesArchive,
      serviceFile
    ]));
  });
};
