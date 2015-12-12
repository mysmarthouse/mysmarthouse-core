//var Relay = require('../relay');
var Sensor = require('../sensor');

function Communicator(server) {
  this.server = server;
}

Communicator.prototype.start = function start() {
  var sensors = [];
  var relays = [];
  var that = this;
  this.sensors = sensors;
  //this.relays = relays;
  return this.server.getSensorsData()
    .then(function(data) {
      data.forEach(function(item) {
        var newSensor = new Sensor(item);
        newSensor.connect();
        sensors.push(newSensor);
        that.server.sendSensorStatusUpdate(newSensor);
      });
    })
    .then(function runUpdaters() {
      sensors.forEach(function(sensor) {
        sensor.on('data', function(data) {
          that.server.sendSensorDataUpdate(data);
        });
        sensor.on('connected', function(){
          that.server.sendSensorStatusUpdate(sensor);
        });
        sensor.on('disconnected', function(){
          that.server.sendSensorStatusUpdate(sensor);
        });
      });
      //    relays.forEach(function(relay){
      //      relay.on('stateChange', function(state){
      //        that.server.sendRelayUpdate(relay.relayId, state);
      //      });
      //    });
      //    that.server.on('setRelayState', function(data){
      //      var relay = _.findWhere(relays, {relayId: data.relayId});
      //      relay.setState(data.state);
      //    });
      //    that.server.on('getSensorData', function(data, cb){
      //      var sensor = _.findWhere(sensors, {sensorId: data.sensorId});
      //      cb(sensor.getData());
      //    });
    });
};


module.exports = Communicator;