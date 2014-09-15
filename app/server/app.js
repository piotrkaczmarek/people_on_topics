(function() {
  "use strict";
  var express = require('express'),
    http = require('http'),
    path = require('path'),
    redis = require('redis'),
    routes = require('./routes'),
    config = require('./config/defaults'),
    socketController = require('./controllers/socketController'),
    socketio = require('socket.io'),
    socketIoJwt = require('socketio-jwt'),
    socketRedisCoordinator = require('./controllers/socketRedisCoordinator'),
    elasticsearch = require('elasticsearch'),
    Users = require('./models/users').Users;


  var Application = function() {
    var self = this;

    var setupVariables = function() {
      var argv = require('minimist')(process.argv.slice(2));

      self.port =  argv.p || config.serverPort;
      self.tokenSecret = config.tokenSecret;
      self.elasticsearchHost = config.elasticsearchHost;
    };
    var setupDB = function() {
      var esClient = elasticsearch.Client({
        host: self.elasticsearchHost
      });
      self.users = new Users(esClient);
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
      routes(self.expressApp, self.users, self.tokenSecret);
    };
    var setupSocket = function() {
      self.io = socketio.listen(self.server);
      var redisPublisher = redis.createClient(
        config.redis.port,
        config.redis.host, 
        {auth_pass: config.redis.password}
      );
      var redisSubscriber = redis.createClient(
        config.redis.port,
        config.redis.host, 
        {auth_pass: config.redis.password}
      );
      socketController(redisPublisher, self.io, socketIoJwt, self.tokenSecret);
      socketRedisCoordinator(redisSubscriber, self.users, self.io);
    }
    self.initialize = function() {
      setupVariables();
      setupDB();
      setupServer();
      setupRoutes();
      setupSocket();
    };
    self.start = function() {
      self.server.listen(self.port);
      console.log('Express server listening on port',self.port);
    };
  };

  var application = new Application();
  application.initialize();
  application.start();


}());