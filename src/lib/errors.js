/**
 * Module for defining custom errors.
 */
var util = require('util');

/**
 * Base class used to extend custom errors.
 */
var AbstractError = function(msg, constr) {
  AbstractError.super_.call(this);

  Error.captureStackTrace(this, constr || this);

  this.message = msg || 'Error';
  this.name = 'Abstract Error';
};
util.inherits(AbstractError, Error);

exports.AbstractError = AbstractError;