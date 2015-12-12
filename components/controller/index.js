var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Interface = require('./relay-interface');

function Relay(data) {
  if (typeof (data) === Number) {
    this.pin = data;
  } else if (data.relayId) {
    this.relayId = data.relayId;
    this.pin = data.pin;
  } else {
    throw new Error('You must specify relay data');
  }
  this.interface = new Interface(this.pin);
}

util.inherits(Relay, EventEmitter);

Relay.prototype.setState = function(state) {
  this.interface.switch(state);
  this.emit('stateChange', state);
};

module.exports = Relay;