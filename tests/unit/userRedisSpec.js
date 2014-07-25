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
          UsersRedis.get_unique_name('bob', function(unique_name) {
            expect(unique_name).toEqual('bob_2');
            done();
          });
        })
      });
    });
    describe('when name is not taken', function() {
      it('should return the same name', function(done) {
        UsersRedis.get_unique_name('bob', function(unique_name) {
          expect(unique_name).toEqual('bob');
          done();
        });
      });
    });
  });
  describe('.save', function() {
    describe('when all fields are given', function() {
      var user = {
        name: 'bob',
        age: 17,
        sex: 'male'
      }
      it('should save user correctly', function(done) {
        UsersRedis.save(user, function() {
          redis.hgetall('users:'+user.name, function(err,data){
            expect(data).toEqual({age: user.age.toString(), sex: user.sex});
            done();
          });
        });
      });
    });
    describe('when only age field is given', function() {
      var user = {
        name: 'bob',
        age: 19
      }
      it('should save user correctly', function(done) {
        UsersRedis.save(user, function() {
          redis.hgetall('users:'+user.name, function(err,data){
            expect(data).toEqual({age: user.age.toString(), sex: 'undefined'})
            done();
          });
        });
      })
    });
  });
  describe('.get', function() {
    describe('when user is already saved', function() {
      var user = {
        name: 'bob',
        age: 19
      }
      beforeEach(function(done) {
        redis.hset('users:'+user.name,'age',user.age, function(err,data){
          if(err) throw err;
          done();
        })
      });
      it('should match original user', function(done) {
        UsersRedis.get(user.name, function(err,returned_user) {
          expect(returned_user).toEqual(user);
          done();
        })
      });
      it('there should be no undefined fields in returned user', function(done){
        UsersRedis.get(user.name, function(err,returned_user) {
          expect(returned_user.sex).not.toBeDefined();
          done();
        });
      });
    });
    describe('when there is no such user', function() {
      it('should return empty object',function(done) {
        UsersRedis.get('bob', function(err,returned_user) {
          expect(returned_user).toEqual({});
          done();
        })
      });
    });
  });
});