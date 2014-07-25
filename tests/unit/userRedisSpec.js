describe('UsersRedis', function() {
  var redis = require('redis').createClient();
  var usersRedis = require('../../app/server/usersRedis').UsersRedis;

  var UsersRedis = new usersRedis(redis);
  beforeEach(function(done) {
    redis.flushall(function(err) {
      if(err) throw err;
      done();
    });
  });
  describe('.get_unique_name', function() {
    describe('when name is already taken', function() {
      var username = 'bob';
      beforeEach(function(done){
        redis.hset('users:'+username, 'age', 15, function(err,data) {
          if(err) throw err;
          done();        
        });
      });
      it('should return new name', function(done){
        UsersRedis.get_unique_name('bob', function(unique_name) {
          expect(unique_name).toEqual('bob_1');
          done();
        });
      });
      describe('and when the next name is also taken', function(){
        beforeEach(function(done) {
          redis.hset('users:'+username+'_1','sex','male', function(err,data){
            if(err) throw err;
            done();
          })
        });
        it('should return next new name', function(done) {
          UsersRedis.ensure_uniqueness('bob', function(unique_name) {
            expect(unique_name).toEqual('bob_2');
            done();
          });
        })

      });
    });
    describe('when name is not taken', function() {
      it('should return the same name', function(done) {
        UsersRedis.ensure_uniqueness('bob', function(unique_name) {
          expect(unique_name).toEqual('bob');
          done();
        });
      });
    });
  });
});