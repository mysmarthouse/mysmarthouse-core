var util = require('util');
var EventEmitter = require('events').EventEmitter;
var q = require('q');

function SensorInterface(data) {
  //if (typeof (data) === Number) {
  //  this.pin = data;
  //} else {
  //  throw new Error('You must specify sensor data');
  //}
}

util.inherits(SensorInterface, EventEmitter);

SensorInterface.prototype.connect = function() {
  var that = this;
  // TODO: connect to arduino and get a response
  setInterval(function() {
    var value = Math.round(Math.random()*100);
    that.emit('data', value);
  }, 5000);
  return q(true);
};

module.exports = SensorInterface;


