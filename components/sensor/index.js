var util = require('util');
var moment = require('moment');
var EventEmitter = require('events').EventEmitter;
var Interface = require('./sensor-interface');

function Sensor(data) {
  this._id = data._id;
  this.boardId = data.boardId;
  this.pin = data.pin;
  this.interface = new Interface(this.pin, this.boardId);
  this.lastSensorValue = 0;
  this.isConnected = false;
}

util.inherits(Sensor, EventEmitter);

Sensor.prototype.getData = function() {
  return this.lastSensorValue;
};

Sensor.prototype.connect = function() {
  var that = this;
  return this.interface.connect()
    .then(function() {
      that.isConnected = true;
      that.emit('connected');
      if (!that.connectionInterval) {
        that._setupEvents();
        that._runUpdaters();
      }
    });
};

Sensor.prototype._setupEvents = function _setupEvents() {
  var that = this;
  this.interface.on('data', function(data) {
    if (data !== that.lastSensorValue) {
      that.lastSensorValue = data;
      that.lastSensorUpdate = moment();
      data = {
        value: data,
        _id: that._id
      };
      that.emit('data', data);
    }
  });
};

Sensor.prototype._runUpdaters = function _runUpdaters() {
  var that = this;
  this.connectionInterval = setInterval(function() {
    if (moment().diff(that.lastSensorUpdate, 'seconds') > 10 && that.isConnected) {
      that.isConnected = false;
      that.emit('disconnected', that._id);
    }

    if (moment().diff(that.lastSensorUpdate, 'seconds') > 10 && !that.isConnected) {
      that.connect();
    }
  }, 10000);
};

module.exports = Sensor;


