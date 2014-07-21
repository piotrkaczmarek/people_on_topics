(function() {
  "use strict";
  var express = require('express'),
    app = express(),
    path = require('path'),
    MongoClient = require('mongodb').MongoClient,
    routes = require('./routes');

  MongoClient.connect('mongodb://localhost:27017/app', function(err,db) {
    if(err) throw err;

    app.use(express.bodyParser());

    app.configure(function() {
      app.use(express.static(path.resolve('./app/client')));
    });
    // Application routes
    routes(app, db);

    app.listen(8080);
    console.log('Express server listening on port 8080');
  });

}())
