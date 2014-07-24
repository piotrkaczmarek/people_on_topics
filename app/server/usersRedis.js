function UsersRedis(redis) {
  "use strict";


  /* If this constructor is called without the "new" operator, "this" points
   * to the global object. Log a warning and call it correctly. */
  if(false === (this instanceof UsersRedis)) {
    console.log('Error: UsersRedis constructor called without "new" operator');
    return new Error('Error: UsersRedis constructor called without "new" operator');
  }

  this.ensure_uniqueness = function(user_name, callback) {
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
  }
}

module.exports.UsersRedis = UsersRedis;