(function() {
  "use strict";
  var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    path = require('path'),
    redis = require('redis'),
    routes = require('./routes'),
    socketController = require('./socketController');

  var argv = require('minimist')(process.argv.slice(2));
  var port = 8080;
  if(argv.p) {
    port = argv.p;
  }

  app.use(express.bodyParser());

  app.configure(function() {  
    app.set('views',path.resolve('./app/client/views'));
    app.set('view engine', 'jade');
    app.use(express.static(path.resolve('./app/client')));
  });

  var redisPublisher = redis.createClient(),
      redisSubscriber = redis.createClient();

  routes(app, redisPublisher);
  socketController(server, redisPublisher, redisSubscriber);

  server.listen(port);
  console.log('Express server listening on port '+port);


}())
