var io = require('socket.io-client');
var q = require('q');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function Server() {

}

util.inherits(LeapTaggableCtrl, EventEmitter);

Server.prototype.connect = function(host, port) {
  var deferred = q.defer();
  var that = this;
  this.socket = io.connect(url, {
    port: port
  });
  this.socket.on('connect', function() {
    that.setupEvents();
    deferred.resolve();
  });
  this.socket.on('connect_error', function(err) {
    deferred.reject(err);
  });
  return deferred.promise;
};

Server.prototype.setupEvents = function() {
  var that = this;
  this.socket.on('setRelayState', function(data) {
    that.emit('setRelayState', data);
  });

  this.socket.on('getSensorData', function(sensorId, cb) {
    that.emit('getSensorData', sensorId, cb);
  });
};

Server.prototype.sendSensorUpdate = function(sensorId, data) {
  this.socket.emit('sensorUpdate', sensorId, data);
};

Server.prototype.sendRelayUpdate = function(relayId, data) {
  this.socket.emit('relayUpdate', relayId, data);
};


module.exports = Server;