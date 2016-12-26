#! /usr/bin/env node

var path = require('path');
var program = require('commander');

var validator = require('../lib/validator');
var generate = require('../lib/generate');
var clean = require('../lib/clean');
var commandPkg = require('../package');

var cwd = process.cwd();
var isValid = validator(cwd);

if (!isValid) {
  console.error('Please run specit from within a valid Node.js project');
  process.exit(1);
}

var projectPkg = require(path.resolve(cwd, './package.json'));

program
  .version(commandPkg.version)
  .option('-r --release <release>', 'Specify release number of package')
  .option('-n --name <name>', 'Specify custom name for package')
  .parse(process.argv);

// Commander has a magic property called name when not overriden by a parameter
var name = program.name instanceof Function ? undefined : program.name;

clean(cwd, projectPkg);
generate(cwd, projectPkg, program.release, name, function (err, generated) {
  if (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }

  generated.forEach(function (file) {
    console.log('Created ./%s', file);
  });
  process.exit(0);
});
