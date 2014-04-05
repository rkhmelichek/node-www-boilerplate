var log4js = require('log4js');

exports = function (loggerOpts, filePathPrefix) {
  // Pass custom configuration options.
  log4js.configure(loggerOpts);

  return {
    log: function log() {
      // Capture the stack trace limit and stack formatting function.
      var stackTraceLimit = Error.stackTraceLimit;
      var prepareStackTrace = Error.prepareStackTrace;

      // Just need one stack frame.
      Error.stackTraceLimit = 10;

      // Return the structured stack trace (array of V8-specific CallSite objects).
      Error.prepareStackTrace = function(err, stack) {
        return stack;
      };

      // We only need to capture who called us, ignore the 'log' frame.
      var errorObj = {};
      Error.captureStackTrace(errorObj, log);
      var frame = errorObj.stack[0];

      // Restore the stack trace limit and stack formatting function.
      Error.stackTraceLimit = stackTraceLimit;
      Error.prepareStackTrace = prepareStackTrace;

      // The full path to the module that required us.
      var filename = frame.getFileName();

      function modulePath(filename) {
        var idx;
        if ((idx = filename.indexOf(filePathPrefix)) >= 0) {
          // Remove the `filePathPrefix` and the '.js' file extension.
          filename = filename.substring(idx + filePathPrefix.length, filename.length - 3);
        } else {
          // Just remove the '.js' file extension.
          filename.substring(0, filename.length - 3);
        }

        return filename;
      }

      return log4js.getLogger(modulePath(filename));
    },

    connect: function connect(log) {
      return log4js.connectLogger(log);
    }
  };
};

module.exports = exports;