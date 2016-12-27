var hogan = require('hogan.js');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var getServiceProperties = require('./serviceProperties');

var defaultRelease = 1;

function getReleaseNumber(release) {
  if (release) {
    return release;
  }
  return defaultRelease;
}

function getRequiredBuildPackages(pkg) {
  return _.get(pkg, 'spec.buildRequires', []);
}

function getRequiredPackages(pkg) {
  return _.get(pkg, 'spec.requires', []);
}

function getNoArch(pkg) {
  return _.get(pkg, 'spec.noarch', true);
}

function getInstallDir(pkg) {
  return _.get(pkg, 'spec.installDir', '/opt');
}

function getNodeVersion(pkg) {
  return _.get(pkg, 'engines.node');
}

function getExecutableFiles(pkg) {
  var name = pkg.name;
  var executableFiles = _.get(pkg, 'spec.executable', []).map(function (file) {
    return path.join(getInstallDir(pkg), name, file);
  });

  return {
    executableFiles: executableFiles,
    hasExecutableFiles: executableFiles.length !== 0
  };
}

function buildCommands(pkg) {
  return _.get(pkg, 'spec.build', []);
}

function getPostInstallCommands(pkg) {
  return _.get(pkg, 'spec.post', []);
}

function shouldPrune(pkg) {
  return _.get(pkg, 'spec.prune', true);
}

function getTemplate(pkg, cwd) {
  if (_.has(pkg, 'spec.specTemplate'))
    return path.resolve(cwd, _.get(pkg, 'spec.specTemplate'));
  else
    return path.resolve(__dirname, '../templates/spec.mustache');
}

module.exports = function (cwd, specit, pkg, release) {
  var serviceProperties = _.assign({
      release: getReleaseNumber(release),
      dist: specit.distribution,
      requires: getRequiredPackages(pkg),
      buildRequires: getRequiredBuildPackages(pkg),
      noarch: getNoArch(pkg),
      installDir: getInstallDir(pkg),
      buildCommands: buildCommands(pkg),
      postInstallCommands: getPostInstallCommands(pkg),
      nodeVersion: getNodeVersion(pkg),
      version: pkg.version,
      license: pkg.license,
      prune: shouldPrune(pkg)
    },
    getExecutableFiles(pkg),
    getServiceProperties(pkg)
  );

  var templateFile = fs.readFileSync(getTemplate(pkg, cwd), 'utf-8');
  var template = hogan.compile(templateFile);

  return template.render(serviceProperties);
};
