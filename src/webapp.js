var bodyParser = require('body-parser'),
    express = require('express'),
    favicon = require('static-favicon'),
    fs = require('fs'),
    http = require('http'),
    path = require('path'),
    sass = require('node-sass'),
    swig = require('swig'),
    util = require('util');

exports = function (isProduction, logger,
                    serverError, serverNotFound,
                    rootRoute) {
  var log = logger.log();

  function configure (app) {
    app.engine('html', swig.renderFile);
    app.set('view engine', 'html');
    app.set('views', path.join(__dirname, 'views'));

    // Enable pretty printing of HTML views for development only.
    app.locals.pretty = !isProduction;

    // Avoid request logging and cookie/session parsing logic for static files (including the favicon).
    app.use(favicon('public/favicon.ico'));

    // Sass middleware.
    app.use(sass.middleware({
      src: path.join(__dirname, 'sass'),
      dest: path.join(__dirname, 'public/compiled/css'),
      prefix: '/css',
      debug: !isProduction,
      force: !isProduction,
      sourceComments: isProduction ? 'none' : 'normal',
      outputStyle: isProduction ? 'compressed' : 'expanded'
    }));
    app.use(express.static(path.join(__dirname, 'public/compiled')));

    if (isProduction) {
      // Static file requests will be given precedence to load from '/public/production'.
      // This directory contains optimized javascript files.
      app.use(express.static(path.join(__dirname, 'public/production')));
    }

    // All other static resources.
    app.use(express.static(path.join(__dirname, 'public')));

    // Log HTTP requests.
    app.use(logger.connect(log));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded());

    app.use('/', rootRoute.router);

    // The last route is a catch-all for page not found.
    app.use(serverNotFound.express());

    // Configure error handling middleware.
    app.use(serverError.express());
  }

  return {
    initialize: function () {
      var app = express();
      configure(app);
      return app;
    }
  }
};

exports.__module = {
  args: ['isProduction', 'logger',
    'middleware/serverError', 'middleware/serverNotFound',
    'routes/index']
};

module.exports = exports;