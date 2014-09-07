(function() {
  "use strict";
  var express = require('express'),
    http = require('http'),
    fs = require('fs'),
    path = require('path'),
    redis = require('redis'),
    routes = require('./routes'),
    socketController = require('./socketController'),
    socketio = require('socket.io'),
    socketIoJwt = require('socketio-jwt'),
    socketRedisCoordinator = require('./socketRedisCoordinator'),
    elasticsearch = require('elasticsearch'),
    UsersElasticSearch = require('./usersElasticSearch').UsersElasticSearch;


  var Application = function() {
    var self = this;

    var setupVariables = function() {
      self.ipaddress = 'localhost';
      var argv = require('minimist')(process.argv.slice(2));
      self.port =  argv.p || 8080;
      self.socket_url = 'http://localhost:'+self.port; 
      self.token_secret = fs.readFileSync(path.resolve('app/server/config/token.secret'));
      self.elasticsearch_host = 'localhost:9200';
    };
    var setupDB = function() {
      var esClient = elasticsearch.Client({
        host: self.elasticsearch_host
      });
      self.usersDAO = new UsersElasticSearch(esClient);
    };
    var setupServer = function() {
      self.expressApp = express();
      self.server = http.Server(self.expressApp);

      self.expressApp.use(express.bodyParser());
      self.expressApp.configure(function() {  
        self.expressApp.set('views',path.resolve('./app/client/views'));
        self.expressApp.set('view engine', 'jade');
        self.expressApp.use(express.static(path.resolve('./app/client')));
      });
    };
    var setupRoutes = function() {
      routes(self.expressApp, self.usersDAO,self.socket_url, self.token_secret);
    };
    var setupSocket = function() {
      self.io = socketio.listen(self.server);
      var redisPublisher = redis.createClient();
      var redisSubscriber = redis.createClient();
      socketController(redisPublisher, self.io, socketIoJwt, self.token_secret);
      socketRedisCoordinator(redisSubscriber, self.usersDAO, self.io);
    }
    self.initialize = function() {
      setupVariables();
      setupDB();
      setupServer();
      setupRoutes();
      setupSocket();
    };
    self.start = function() {
      self.server.listen(self.port,self.ipaddress);
      console.log('Express server listening on ',self.ipaddress,':',self.port);
    };
  };

  var application = new Application();
  application.initialize();
  application.start();


}());