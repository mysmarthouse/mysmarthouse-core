var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Interface = require('./sensor-interface');

function Sensor(data) {
  if (typeof (data) === Number) {
    this.pin = data;
  } else if (data.sensorId) {
    this.sensorId = data.sensorId;
    this.pin = data.pin;
  } else {
    throw new Error('You must specify sensor data');
  }
  this.interface = new Interface(this.pin);
  this.lastSensorValue = 0;
}

util.inherits(Sensor, EventEmitter);

Sensor.prototype.getData = function() {
  return this.lastSensorValue;
};

Sensor.prototype.setup = function() {
  var that = this;
  this.interface.on('data', function(data) {
    if (data != that.lastSensorValue) {
      that.lastSensorValue = data;
      that.emit('data', data);
    }
  });
};

module.exports = Sensor;


