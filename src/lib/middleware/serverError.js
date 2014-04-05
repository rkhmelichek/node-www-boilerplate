var _ = require('lodash');

exports = function (logger, isProduction, errorResponse) {
  var log = logger.log();

  return {
    /**
     * Log error and respond with server error message in either HTML or JSON.
     *
     * @type {Function}
     */
    express: function () {
      return function serverError (err, req, res, next) {
        log.error('Caught server error', err);

        var error = { };
        if (!isProduction) {
          error.message = err.message;
          error.status = err.status;
          error.stack = err.stack;
        }

        error = _.defaults(error, {
          message: "Internal Server Error",
          status: 500
        });

        errorResponse.renderErrorResponse(req, res, error);
      };
    }
  };
};

exports.__module = {
  args: ['logger', 'isProduction', 'errorResponse']
};

module.exports = exports;