var express = require('express'),
  app = express(),  // Web framework to handle routing requests
  MongoClient = require('mongodb').MongoClient, // Driver for connecting to MongoDB
  routes = require('./routes');


MongoClient.connect('mongodb://localhost:27017/app', function(err,db) {
  "use strict";
  if(err) throw err;

  // Express middleware to populate 'req.body' so we can access POST variables
  app.use(express.bodyParser());

  // Application routes
  routes(app, db);

  app.listen(8080);
  console.log('Express server listening on port 8080');
});