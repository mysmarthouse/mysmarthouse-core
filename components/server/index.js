var io = require('socket.io-client');
var q = require('q');
var util = require('util');
var request = require('request-promise');
var EventEmitter = require('events').EventEmitter;

function Server(config) {
  this.config = config;
}

util.inherits(Server, EventEmitter);

Server.prototype._setupEvents = function() {
  var that = this;

  this.socket.on('station:reset', function() {
    console.log('resetting station');
    that.emit('reset');
  });

  this.socket.on('reconnect', function(socket) {
    that.socket.emit('station:connect', that.config.stationId);
  });

  this.pingInterval = setInterval(function() {
    that.socket.emit('station:ping', that.config.stationId);
  }, 1000);
};

Server.prototype.connect = function(host, port) {
  var deferred = q.defer();
  var that = this;
  this.socket = io.connect(that.config.serverHost, { timeout: 2000 });
  this.socket.on('connect', function(socket) {
    that._setupEvents();
    //socket.join('some room');
    that.socket.emit('station:connect', that.config.stationId);
    deferred.resolve();
  });

  this.socket.on('connect_error', function(err) {
    console.log('not connected :(');
    deferred.reject(err);
  });
  return deferred.promise;
};

Server.prototype.getSensorsData = function() {
  var options = {
    url: this.config.serverHost + this.config.apiPath + 'sensors/',
    json: true
  };
  return request(options);
};

Server.prototype.getControllersData = function() {

};

Server.prototype.sendSensorDataUpdate = function(data) {
  this.socket.emit('sensor:data', data);
};

Server.prototype.sendSensorStatusUpdate = function(data) {
  this.socket.emit('sensor:status', data);
};

Server.prototype.sendRelayUpdate = function(data) {
  this.socket.emit('relayUpdate', data);
};


module.exports = Server;