function UsersElasticSearch(db) {
    /* If this constructor is called without the "new" operator, "this" points
   * to the global object. Log a warning and call it correctly. */
  if(false === (this instanceof UsersElasticSearch)) {
    console.log('Error: UsersElasticSearch constructor called without "new" operator');
    return new Error('Error: UsersElasticSearch constructor called without "new" operator');
  }

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
    }
    save_unique(save_unique, callback);
  }
  this.save = function(user,topics,callback) {
    var doc = {
      index: 'users',
      type: 'user',
      op_type: 'create'
    }
    user.topics = topics;
    doc.body = user;
    doc.id = user.name;
    db.index(doc, function(err,response) {
      callback(err,response);
    });
  };
  this.get_all_online = function(callback) {
    db.search({index: 'users', type:'user'}, function(err,response) {
      if(err) throw err;
      var users = {};

      for(var i = 0; i < response.hits.hits.length; i++) {
        var user = response.hits.hits[i]._source;
        users[user.name] = user;
      }
      callback(users);
    });
  };
  this.remove = function(user_name, callback) {
    db.delete({index: 'users', type: 'user', id: user_name}, function(err,response) {
      if(err && err.message !== 'Not Found') throw err;
      callback();
    })
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