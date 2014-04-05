var SD_LISTEN_FDS_START = 3;

exports.sdListenFds = function() {
  var sdFds = [];

  var numFds;
  if (process.pid == Number(process.env['LISTEN_PID']) && (numFds = Number(process.env['LISTEN_FDS'])) > 0) {
    for (var fd = SD_LISTEN_FDS_START; fd < (SD_LISTEN_FDS_START + numFds); fd++) {
      sdFds.push(fd);
    }
  }

  return sdFds;
};

module.exports = exports;