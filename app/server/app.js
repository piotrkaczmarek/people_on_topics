(function() {
  "use strict";
  var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    path = require('path'),
    redis = require('redis'),
    routes = require('./routes'),
    socketController = require('./socketController'),
    io = require('socket.io').listen(server),
    socketIoJwt = require('socketio-jwt'),
    redisPublisher = redis.createClient(),
    redisSubscriber = redis.createClient(),
    UsersRedis = require('./usersRedis').UsersRedis,
    usersRedis = new UsersRedis(redisPublisher),
    socketRedisCoordinator = require('./socketRedisCoordinator');
        
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

  routes(app, redisPublisher);
  socketController(redisPublisher, io, socketIoJwt);
  socketRedisCoordinator(redisSubscriber, usersRedis, io);

  server.listen(port);
  console.log('Express server listening on port '+port);
}())