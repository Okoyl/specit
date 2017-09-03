var truncate = require('./truncate');
var _ = require('lodash');

function getEnvironment(pkg) {
  var environment = _.get(pkg, 'spec.environment', {});
  return Object.keys(environment).map(function(key) {
    return { key: key, value: environment[key]};
  });
}

function getInstallDir(pkg) {
  return _.get(pkg, 'spec.installDir', '/opt/' + pkg.name);
}

module.exports = function (pkg) {
  return {
    name: pkg.name,
    username: truncate(pkg.name),
    description: pkg.description,
    environment: getEnvironment(pkg),
    installDir: getInstallDir(pkg)
  };
};
