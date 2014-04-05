var assert = require('assert'),
    should = require('should');

var systemdSocket = require('../../src/lib/systemdSocket.js');

describe('systemd integration module', function() {
  before(function() {
    delete process.env['LISTEN_PID'];
    delete process.env['LISTEN_FDS'];
  });

  it('Returns no systemd fds because pid does not match', function() {
    process.env['LISTEN_PID'] = 1;
    process.env['LISTEN_FDS'] = 1;

    var sdFds = systemdSocket.sdListenFds();
    assert(sdFds != null);
    sdFds.length.should.equal(0);
  });

  it('Returns no systemd fds because no LISTEN_FDS env variable', function() {
    process.env['LISTEN_PID'] = 1;

    var sdFds = systemdSocket.sdListenFds();
    assert(sdFds != null);
    sdFds.length.should.equal(0);
  });

  it('Returns one systemd fd', function() {
    process.env['LISTEN_PID'] = process.pid;
    process.env['LISTEN_FDS'] = 1;

    var sdFds = systemdSocket.sdListenFds();
    assert(sdFds != null);
    sdFds.length.should.equal(1);
    sdFds[0].should.equal(3);
  });

  it('Returns three systemd fds', function() {
    process.env['LISTEN_PID'] = process.pid;
    process.env['LISTEN_FDS'] = 3;

    var sdFds = systemdSocket.sdListenFds();
    assert(sdFds != null);
    sdFds.length.should.equal(3);
    sdFds[0].should.equal(3);
    sdFds[1].should.equal(4);
    sdFds[2].should.equal(5);
  });
});