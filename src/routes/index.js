var express = require('express');

exports = function (logger) {
  var log = logger.log();

  function index (req, res) {
    res.render('index', {
      title: 'node.js www boilerplate'
    });
  }

  var router = express.Router();
  router.get('/', index);

  return {
    router: router
  };
};

exports.__module = {
  args: ['logger']
};

module.exports = exports;