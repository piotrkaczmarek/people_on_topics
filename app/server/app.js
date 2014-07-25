(function() {
  "use strict";
  var express = require('express'),
    app = express(),
    path = require('path'),
    redis = require('redis').createClient(),
    routes = require('./routes');



  app.use(express.bodyParser());

  app.configure(function() {  
    app.set('views',path.resolve('./app/client/views'));
    app.set('view engine', 'jade');
    app.use(express.static(path.resolve('./app/client')));
  });
  // Application routes
  routes(app, redis);

  app.listen(8080);
  console.log('Express server listening on port 8080');

}())
