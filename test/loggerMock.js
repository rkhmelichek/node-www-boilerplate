exports.log = function () {
  return {
    fatal: function (str) {
      console.error(str);
    },
    error: function (str) {
      console.error(str);
    },
    warn: function (str) {
      console.error(str);
    },
    info: function (str) {
      console.log(str);
    },
    debug: function (str) {
      console.log(str);
    },
    trace: function (str) {
      console.log(str);
    }
  };
};