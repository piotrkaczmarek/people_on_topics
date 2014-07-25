(function() {
  "use strict";
  var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    path = require('path'),
    redis = require('redis').createClient(),
    routes = require('./routes'),
    io = require('socket.io').listen(server),
    socketIoJwt = require('socketio-jwt');



  app.use(express.bodyParser());

  app.configure(function() {  
    app.set('views',path.resolve('./app/client/views'));
    app.set('view engine', 'jade');
    app.use(express.static(path.resolve('./app/client')));
  });
  // Application routes
  routes(app, redis);

  server.listen(8080);
  console.log('Express server listening on port 8080');

  io.use(socketIoJwt.authorize({
    secret: 'secret',
    handshake: true
  }));

  io.on('connection', function(socket) {
    var user = socket.decoded_token;
    console.log("Socket connected with: ",user);
  });

}())
