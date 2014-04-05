exports = function () {
  return {
    renderErrorResponse: function (req, res, errorObj) {
      res.status(errorObj.status);

      var accept = req.headers.accept || '';
      if (~accept.indexOf('json')) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          status: {
            success: false,
            error: errorObj
          }
        }));
      } else {
        res.render('error', errorObj);
      }
    }
  };
};

exports.__module = {
  args: []
};

module.exports = exports;