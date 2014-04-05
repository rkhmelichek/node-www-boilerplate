exports = function (logger, errorResponse) {
  var log = logger.log();

  /**
   * Respond with a page not found message in either HTML or JSON.
   *
   * @type {Function}
   */
  return {
    express: function () {
      return function serverNotFound (req, res, next) {
        var error = {
          message: "Not Found",
          status: 404
        };

        errorResponse.renderErrorResponse(req, res, error);
      };
    }
  };
};

exports.__module = {
  args: ['logger', 'errorResponse']
};

module.exports = exports;