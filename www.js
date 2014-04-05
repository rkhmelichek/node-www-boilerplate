var commander = require('commander'),
    http = require('http'),
    path = require('path'),
    Scatter = require('scatter'),
    util = require('util');

var systemdSocket = require('./src/lib/systemdSocket');

commander
    .option('-l, --log [path]', 'Path to the the log file')
    .parse(process.argv);

var loggerAppenders = [{
  "type": "console"
}];

if (commander.log) {
  loggerAppenders.push({
    "type": "file",
    "filename": commander.log,
    "maxLogSize": 134217728,
    "backups": 8
  });
}

// Initialize and configure application logger.
var loggerOpts = {
  "appenders": loggerAppenders
};
var logger = require('./src/lib/logger.js')(loggerOpts, __dirname);

var log = logger.log();

// We will start the server in development mode if and only if `NODE_ENV` is set to 'development';
// the default is to start in production mode.
var isProduction = process.env.NODE_ENV !== 'development';

// Initialize the dependency injector.
var scatter = new Scatter({
  // Logging function for the Scatter DI framework.
  log: function (level) {
    var args = Array.prototype.slice.call(arguments, 1);
    switch (level) {
      case 'trace':
        log.trace.apply(log, args);
        break;
      case 'warn':
        log.warn.apply(log, args);
        break;
      case 'info':
        log.info.apply(log, args);
        break;
      default:
        log.fatal.apply(log, args);
    }
  }
});
scatter.setNodeModulesDir(path.join(__dirname, 'node_modules'));
scatter.registerParticles(path.join(__dirname, 'src'));
scatter.registerParticles(path.join(__dirname, 'src/lib'));
scatter.registerModuleInstance('logger', logger, {});
scatter.registerModuleInstance('isProduction', isProduction, { });

scatter.load('webapp').done(function (webapp) {
  log.info("Successfully bootstrapped webapp in %s mode", (isProduction ? "production" : "development"));

  var server = http.createServer(webapp.initialize());

  var sdFds;
  if ((sdFds = systemdSocket.sdListenFds()).length) {
    var sdFd = sdFds[0];
    server.listen({fd: sdFd}, function () {
      log.info("Express server listening on systemd socket fd: " + sdFd);
    });
  } else {
    var port = process.env.PORT || 9090;
    server.listen(port, function () {
      log.info("Express server listening on port: " + server.address().port);
    });
  }

  // Override the shutdown function.
  var shutdownInitiated = false;
  var shutdownFn = function (status) {
    if (!shutdownInitiated) {
      shutdownInitiated = true;
      log.warn("Closing server...");

      server.close(function () {
        log.warn("Exiting...");
        process.exit(status || 0);
      });
    }
  };

  process.once('SIGTERM', function () {
    log.warn('Caught SIGTERM - shutting down...');
    shutdownFn();
  });

  process.once('SIGINT', function () {
    log.warn('Caught SIGINT - shutting down...');
    shutdownFn();
  });

  process.once('uncaughtException', function (err) {
    log.fatal("Caught fatal exception - exiting...", err);
    process.exit(1);
  });
}, function (err) {
  log.fatal("Error bootstrapping webapp - exiting...", err);
  process.exit(1);
});