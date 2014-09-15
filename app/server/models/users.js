function Users(db) {
  var async = require('async');
    /* If this constructor is called without the "new" operator, "this" points
   * to the global object. Log a warning and call it correctly. */
  if(false === (this instanceof Users)) {
    console.log('Error: Users constructor called without "new" operator');
    return new Error('Error: Users constructor called without "new" operator');
  }

  var topicsQuery = function(topics) {
    var body = {
      query: {      
        bool: {
          should : [],
          minimum_should_match: 1
        }
      }
    };
    topics.forEach(function(element) {
      var term = {
        term: {
          topics: element
        }
      };
      body.query.bool.should.push(term);
    });
    return body;
  };
  var makeUsersArray = function(response, callback) {
    var users = [];
    var iterator = function(item, cb) {
      var user = item._source;
      user.score = item._score;
      users.push(user);
      cb();
    };
    async.each(response.hits.hits, iterator, function() {
      callback(users);
    });
  };
  this.getAllUsersByTopics = function(topics, callback) {
    db.search({index: 'users', type: 'user', body: topicsQuery(topics)}, function(err, response) {
      if(err) throw err;
      makeUsersArray(response,callback);
    });
  };
  this.getUsersByTopics = function(usernames, topics, callback) {
    var body = {
      query: {
        filtered: {
          query: topicsQuery(topics).query,
          filter: {
            ids: {
              values: usernames
            }
          }
        }
      }
    };
    db.search({index: 'users', type: 'user', body: body}, function(err, response) {
      if(err) throw err;
      makeUsersArray(response,callback);
    });
  };
  this.add = function(user,topics, callback) {
    var saveUser = this.save;
    var timesChecked = 0;
    var saveUnique = function(self, cb) {
      saveUser(user, topics, function(err,response) {
        if(err && err.message.slice(0,21) === 'DocumentAlreadyExists') {
          timesChecked += 1;
          user.name += '_'+ timesChecked;
          return self(self,cb);
        } else if(err) {
          throw err;
        } else {
          return cb(user);
        }
      });
    };
    saveUnique(saveUnique, callback);
  };
  this.save = function(user,topics,callback) {
    var doc = {
      index: 'users',
      type: 'user',
      op_type: 'create'
    };
    user.topics = topics;
    doc.body = user;
    doc.id = user.name;
    db.index(doc, function(err,response) {
      callback(err,response);
    });
  };
  this.remove = function(userName, callback) {
    db.delete({index: 'users', type: 'user', id: userName}, function(err,response) {
      if(err && err.message !== 'Not Found') throw err;
      callback();
    });
  };
  this.get = function(userName, callback) {
    db.get({index: 'users', type:'user', id: userName}, function(err, response) {
      if(err && err.message !== 'Not Found') throw err;
      if(response.found) {
        callback(response._source);
      } else {
        callback({});
      }
    });
  };
}

module.exports.Users = Users;