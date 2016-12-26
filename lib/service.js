var hogan = require('hogan.js');
var fs = require('fs');
var path = require('path');
var getServiceProperties = require('./serviceProperties');

var templateFile = fs.readFileSync(path.resolve(__dirname, '../templates/systemd.mustache'), 'utf-8');
var template = hogan.compile(templateFile);

module.exports = function (pkg) {
  var serviceProperties = getServiceProperties(pkg);

  return template.render(serviceProperties);
};
