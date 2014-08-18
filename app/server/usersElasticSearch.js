function UsersElasticSearch(db) {
  var async = require('async');
    /* If this constructor is called without the "new" operator, "this" points
   * to the global object. Log a warning and call it correctly. */
  if(false === (this instanceof UsersElasticSearch)) {
    console.log('Error: UsersElasticSearch constructor called without "new" operator');
    return new Error('Error: UsersElasticSearch constructor called without "new" operator');
  }

  var topics_query = function(topics) {
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
  var make_users_array = function(response, callback) {
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
  this.get_all_users_by_topics = function(topics, callback) {
    db.search({index: 'users', type: 'user', body: topics_query(topics)}, function(err, response) {
      if(err) throw err;
      make_users_array(response,callback);
    });
  };
  this.get_users_by_topics = function(usernames, topics, callback) {
    var body = {
      query: {
        filtered: {
          query: topics_query(topics).query,
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
      make_users_array(response,callback);
    });
  };
  this.add = function(user,topics, callback) {
    var save_user = this.save;
    var times_checked = 0;
    var save_unique = function(self, cb) {
      save_user(user, topics, function(err,response) {
        if(err && err.message.slice(0,21) === 'DocumentAlreadyExists') {
          times_checked += 1;
          user.name += '_'+ times_checked;
          return self(self,cb);
        } else if(err) {
          throw err;
        } else {
          return cb(user);
        }
      });
    };
    save_unique(save_unique, callback);
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
  this.remove = function(user_name, callback) {
    db.delete({index: 'users', type: 'user', id: user_name}, function(err,response) {
      if(err && err.message !== 'Not Found') throw err;
      callback();
    });
  };
  this.get = function(user_name, callback) {
    db.get({index: 'users', type:'user', id: user_name}, function(err, response) {
      if(err && err.message !== 'Not Found') throw err;
      if(response.found) {
        callback(response._source);
      } else {
        callback({});
      }
    });
  };
}

module.exports.UsersElasticSearch = UsersElasticSearch;