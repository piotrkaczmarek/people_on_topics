(function() {
  "use strict";
  var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    path = require('path'),
    redis = require('redis'),
    routes = require('./routes'),
    socketController = require('./socketController');



  app.use(express.bodyParser());

  app.configure(function() {  
    app.set('views',path.resolve('./app/client/views'));
    app.set('view engine', 'jade');
    app.use(express.static(path.resolve('./app/client')));
  });
  // Application routes
  var redisPublisher = redis.createClient(),
      redisSubscriber = redis.createClient();

  routes(app, redisPublisher);
  socketController(server, redisPublisher, redisSubscriber);

  var port = 8080
  server.listen(port);
  console.log('Express server listening on port '+port);


}())
