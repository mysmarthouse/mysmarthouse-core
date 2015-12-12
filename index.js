var Communicator = require('./components/communicator');
var Server = require('./components/server');
var config = require('./config');

function setupServer() {
  var server = new Server(config);
  server.on('reset', function() {
    process.exit(1);
  });
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
  })
  .catch(function(err) {
    console.error(err)
  });
