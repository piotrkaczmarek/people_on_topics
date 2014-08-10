describe('UsersRedis', function() {
  var redis = require('redis').createClient();
  var usersRedis = require('../../../app/server/usersRedis').UsersRedis;

  var UsersRedis = new usersRedis(redis);
  beforeEach(function(done) {
    redis.flushall(function(err) {
      if(err) throw err;
      done();
    });
  });
  var topics = ['weather', 'travels'];
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
  describe('.add', function() {
    describe('when name is not taken', function() {
      var user = {
        name: 'bob',
        age: 17,
        sex: 'male'
      };
      it('should return the same user', function(done) {
        UsersRedis.add(user, topics, function(data) {
          expect(data).toEqual(user);
          done();
        });
      });
      it('should save the user', function() {
        UsersRedis.add(user, topics, function() {
          UsersRedis.get(user.name,function(returned_user) {
            expect(returned_user).toEqual(user);
          });
        });
      });
    });
    describe('when name is taken', function() {
      var user = {
        name: 'bob',
        age: 17,
        sex: 'male'
      };
      beforeEach(function(done) {
        redis.flushall(function() {
          UsersRedis.save(user, topics, function() {
            done();
          });
        });
      });
      afterEach(function(done) {
        redis.flushall(function() {
          done();
        });
      });
      it('should return user with updated name', function(done) {
        UsersRedis.add(user, topics, function(data) {
          expect(data.name).toEqual('bob_1');
          done();
        });
      });
      it('should save the user with unique name', function(done) {
        UsersRedis.add(user, topics,function(saved_user) {
          UsersRedis.get(saved_user.name, function(returned_user) {
            expect(returned_user).toEqual(saved_user);
            done();
          });
        });
      });
      it('should create only one user', function(done) {
        UsersRedis.add(user, topics,function() {
          UsersRedis.get_all_online(function(users) {
            expect(Object.keys(users).length).toEqual(2);
            done();
          });
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
        UsersRedis.save(user, topics, function() {
          redis.hgetall('users:'+user.name, function(err,data){
            expect(data).toEqual({age: user.age.toString(), sex: user.sex});
            done();
          });
        });
      });
      it('should add user to users set', function(done) {
        UsersRedis.save(user, topics, function() {
          redis.smembers('users', function(err,data) {
            expect(data).toContain('bob');
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
        UsersRedis.save(user, topics, function() {
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
        UsersRedis.get(user.name, function(returned_user) {
          expect(returned_user).toEqual(user);
          done();
        })
      });
      it('there should be no undefined fields in returned user', function(done){
        UsersRedis.get(user.name, function(returned_user) {
          expect(returned_user.sex).not.toBeDefined();
          done();
        });
      });
    });
    describe('when there is no such user', function() {
      it('should return empty object',function(done) {
        UsersRedis.get('bob', function(returned_user) {
          expect(returned_user).toEqual({});
          done();
        })
      });
    });
  });
  describe('.get_all_online', function() {
    describe('when there are two users online', function() {
      var users = {
        'bob': { name: 'bob',
          age: 29,
          sex: 'male'
        },
        'susan': {
          name: 'susan',
          age: 19
        }
      };
      beforeEach(function(done) {
        var users_ready = 0;
        var add_user = function(user) {
          redis.hmset(['users:'+user.name, 'age', user.age, 'sex', user.sex],function() {
            redis.sadd('users', user.name, function() {
              users_ready += 1;
              if(users_ready  >= Object.keys(users).length ) {
                done();
              }
            });
          });  
        }
        for(key in users) {
          add_user(users[key]);      
        };
      });
      it('should return both users data', function(done) {
        UsersRedis.get_all_online(function(data) {
          expect(data).toEqual(users);
          done();
        });
      });
    });
    describe('when there are no online users', function() {
      it('should return empty array', function(done) {
        UsersRedis.get_all_online(function(users) {
          expect(users).toEqual({});
          done();
        });
      });
    });
  });
  describe('.remove', function() {
    describe('when there is saved user', function() {
      var user = {
        name: 'bob',
        age: 24
      };
      beforeEach(function(done) {
        redis.hmset(['users:'+user.name,'age', user.age], function() {
          redis.sadd('users', user.name, function() {
            done();
          })
        });
      });
      it('should remove the user from redis hash', function(done) {
        UsersRedis.remove(user.name, function() {
          redis.hgetall('users:'+user.name, function(err, data) {
            expect(data).toEqual(null);
            done();
          });
        });
      });
      it('should remove the user from redis set', function(done) {
        UsersRedis.remove(user.name, function() {
          redis.smembers('users', function(err,data) {
            expect(data).toEqual([]);
            done();
          });
        });
      });
    });
    describe('when there is no such user', function() {
      it('should not raise exception', function(){
        expect( function() {
          UsersRedis.remove('bob',function(){});
        }).not.toThrow();
      });
    });
  });

});