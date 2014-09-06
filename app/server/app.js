(function() {
  "use strict";
  var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    fs = require('fs'),
    path = require('path'),
    redis = require('redis'),
    routes = require('./routes'),
    socketController = require('./socketController'),
    io = require('socket.io').listen(server),
    socketIoJwt = require('socketio-jwt'),
    redisPublisher = redis.createClient(),
    redisSubscriber = redis.createClient(),
    socketRedisCoordinator = require('./socketRedisCoordinator'),
    elasticsearch = require('elasticsearch'),
    UsersElasticSearch = require('./usersElasticSearch').UsersElasticSearch;

  var esClient = elasticsearch.Client({
    host: 'localhost:9200'
  });
  var usersDAO = new UsersElasticSearch(esClient);
        
  var argv = require('minimist')(process.argv.slice(2));
  var port =  argv.p || 8080;
  var socket_url = 'http://localhost:'+port; 
  var token_secret = fs.readFileSync(path.resolve('app/server/config/token.secret'));


  app.use(express.bodyParser());

  app.configure(function() {  
    app.set('views',path.resolve('./app/client/views'));
    app.set('view engine', 'jade');
    app.use(express.static(path.resolve('./app/client')));
  });

  routes(app, usersDAO,socket_url, token_secret);
  socketController(redisPublisher, io, socketIoJwt, token_secret);
  socketRedisCoordinator(redisSubscriber, usersDAO, io);

  server.listen(port);
  console.log('Express server listening on port '+port);
}());