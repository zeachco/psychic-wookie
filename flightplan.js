var plan = require('flightplan');

plan.target('nodium', [{
  host: 'nodium',
  username: 'root',
  agent: process.env.SSH_AUTH_SOCK
}]);

var tmpDir = 'release-' + new Date().getTime();
var tmpDir = 'app';

// run commands on localhost
plan.local(function(local) {
  //local.log('Run build');
  //local.exec('gulp');
  local.log('Copy files to remote hosts');

  var ex = 'git ls-files';
  [
    '/libs/bootstrap/dist/css/bootstrap.min.css',
    '/libs/bootstrap/dist/css/bootstrap-theme.min.css',
    '/libs/angularjs/angular.min.js',
    '/libs/angularjs/angular.min.js.map',
    '/libs/d3/d3.min.js'
  ].forEach(function(l) {
    ex += ' && echo app/public' + l + '';
  });
  console.log(ex);
  var filesToCopy = local.exec(ex, {
    silent: true
  });
  // rsync files to all the target's remote hosts
  local.transfer(filesToCopy, '/tmp/' + tmpDir);
});

// run commands on the target's remote hosts
plan.remote(function(remote) {
  remote.log('Move folder to web root');
  remote.sudo('cp -R /tmp/' + tmpDir + ' ~');
  remote.rm('-rf /tmp/' + tmpDir);

  remote.log('Install dependencies');
  remote.sudo('npm --production --prefix ~/' + tmpDir + ' install ~/' + tmpDir);

  remote.log('Reload application');
  //remote.sudo('ln -snf ~/' + tmpDir + ' ~/app');
  // remote.sudo('pm2 reload example-com'); */
});
