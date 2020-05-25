const exec = require('child_process').exec;
console.log('Installing tools to work with ZSUI library...');
exec('npm install -g grunt-cli').on('exit', () => console.log('grunt-cli installed'));
