var Communicator = require('./components/communicator');
var Server = require('./components/server');

function setupServer() {
  var server = new Server();
  return server.connect()
    .then(function() {
      return server;
    });
}

function setupCommunicator(server) {
  var communicator = new Communicator(server);
  return communicator.start();
}

setupServer().then(setupCommunicator)
  .then(function() {
    console.log('Core application started...');
  });