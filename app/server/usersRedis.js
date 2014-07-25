function UsersRedis(redis) {
  "use strict";


  /* If this constructor is called without the "new" operator, "this" points
   * to the global object. Log a warning and call it correctly. */
  if(false === (this instanceof UsersRedis)) {
    console.log('Error: UsersRedis constructor called without "new" operator');
    return new Error('Error: UsersRedis constructor called without "new" operator');
  }

  this.get_unique_name = function(user_name, callback) {
    var times_checked = 0;
    var check_uniqueness = function(name, self) {
      redis.hgetall('users:'+name, function(err, data){
        if(err) throw err;
        if(data) {
          times_checked += 1;
          self(user_name+'_'+times_checked, self);
        } else {
          return callback(name);
        }
      });
    };

    check_uniqueness(user_name, check_uniqueness);
  };

  this.save = function(user, callback) {
    redis.hmset(['users:'+user.name, 'age', user.age, 'sex', user.sex], function(err,data){
      if(err) throw err;
      callback();
    })
  };

  this.get = function(user_name, callback) {
    redis.hgetall('users:'+user_name, function(err,data) {
      if(err) throw err;
      
      var user = {};
      if(data) {
        user.name = user_name
        if(data.age !== 'undefined') {
          user.age = parseInt(data.age);
        }
        if(data.sex !== 'undefined') {
          user.sex = data.sex;
        }
      } 
      callback(err,user);
    });
  };
}

module.exports.UsersRedis = UsersRedis;