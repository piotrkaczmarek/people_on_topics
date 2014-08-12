describe('usersElasticSearch', function() {
  var usersElasticSearch = require('../../../app/server/usersElasticSearch').UsersElasticSearch;
  var elasticsearch = require('elasticsearch');

  var client = new elasticsearch.Client({
    host: 'localhost:9200'
  });
  var usersES = new usersElasticSearch(client);
  var add_user = function(user, topics, callback) {
    usersES.save(user,topics,function(err,response) {
      client.indices.refresh({index:'users'}, function() {
        callback();
      });
    });
  };
  var topics = ['weather', 'travels'];

  beforeEach(function(done) {
    client.deleteByQuery({index: 'users', body: {query: {match_all: {}}}}, function(err,response) {
      done();
    })
  });
  describe('.save', function() {
    describe('when user is passed with topics', function() {
      var users = {
          'bob':{
            name: 'bob',
            age: 17,
            sex: 'male'
          }
        };
      it('should save user', function(done) {
        usersES.save(users.bob,topics,function() {
          usersES.get_all_users(function(data) {
            expect(data).toEqual(data);
            done();
          });
        });
      });
    });
  });
  describe('.get_all_users_by_topics', function() {
    describe('when there are two topics queried', function() {
      describe('and there two users who have these topics', function() {
        var users = { 
          'bob':{
            name: 'bob',
            age: 17,
            sex: 'male'
          },
          'susan': {
            name: 'susan',
            age: 19
          },
          'george': {
            name: 'george'
          }
        };
        var topics = {
          'bob': ['topic1', 'topic2'],
          'susan': ['topic1', 'topic3'],
          'george': ['topic3']
        };
        beforeEach(function(done) {
          var users_ready = 0;
          for(key in users) {
            add_user(users[key],topics[key], function() {        
              users_ready += 1;
              if(users_ready >= Object.keys(users).length ) {
                done();
              }
            });
          }
        });
        it('should return only users that have these topics', function(done) {
          usersES.get_all_users_by_topics(['topic1', 'topic2'], function(data) {
            expect(data.susan).toBeDefined();
            expect(data.bob).toBeDefined();
            expect(data.george).not.toBeDefined();
            done();
          });
        });
        it('should give higher score for those who match more topics', function(done) {
          usersES.get_all_users_by_topics(['topic1', 'topic2'], function(data) {
            expect(data.bob.score).toBeGreaterThan(data.susan.score);
            done();
          });
        });
      });
      describe('and there are no users who have these topics', function() {
        it('should return empty object', function(done) {
          usersES.get_all_users_by_topics(['topic1'], function(data) {
            expect(data).toEqual({});
            done();
          });
        });
      });
    });
  });
  describe('.get_users_by_topics', function() {
    var users = { 
      'bob':{
        name: 'bob',
        age: 17,
        sex: 'male'
      },
      'susan': {
        name: 'susan',
        age: 19
      },
      'george': {
        name: 'george'
      }
    };
    var topics = {
      'bob': ['topic1', 'topic2'],
      'susan': ['topic1', 'topic3'],
      'george': ['topic3']
    };
    beforeEach(function(done) {
      var users_ready = 0;
      for(key in users) {
        add_user(users[key],topics[key], function() {        
          users_ready += 1;
          if(users_ready >= Object.keys(users).length ) {
            done();
          }
        });
      }
    });
    it('should return only queried users', function(done) {
      usersES.get_users_by_topics(['susan'],['topic3'], function(users) {
        expect(users.bob).not.toBeDefined();
        expect(users.george).not.toBeDefined();
        expect(users.susan).toBeDefined();
        done();
      });
    });
    it('he should get the same score as when getting the whole list', function(done) {
      usersES.get_users_by_topics(['bob'],['topic1', 'topic2'], function(users) {
        expect(users.bob.score).toEqual(0.2712221);
        done();
      });
    });
    it('he should get the same score as when getting the whole list', function(done) {
      usersES.get_users_by_topics(['susan'],['topic1', 'topic2'], function(users) {
        expect(users.susan.score).toEqual(0.028130025);
        done();
      });
    });
  });
  describe('.get_all_users', function() {
    describe('when there is no user found', function() {
      it('should return no users', function(done) {
        usersES.get_all_users(function(data) {
          expect(data).toEqual({});
          done();
        });
      });
    });
    describe('when there are two users online', function() {
      var users = { 
        'bob':{
          name: 'bob',
          age: 17,
          sex: 'male'
        },
        'susan': {
          name: 'susan',
          age: 19
        }
      };
      beforeEach(function(done) {
        var users_ready = 0;
        for(key in users) {
          add_user(users[key],topics, function() {        
            users_ready += 1;
            if(users_ready >= Object.keys(users).length ) {
              done();
            }
          });
        }
      });
      it('should return both users', function(done) {
        usersES.get_all_users(function(data) {
          expect(data).toEqual(users);
          done();
        });
      });
    });
  });
  describe('.remove', function() {
    describe('when there are two users online', function() {
      var users = { 
        'bob':{
          name: 'bob',
          age: 17,
          sex: 'male'
        },
        'susan': {
          name: 'susan',
          age: 19
        }
      };
      beforeEach(function(done) {
        var users_ready = 0;
        for(key in users) {
          add_user(users[key],topics, function() {        
            users_ready += 1;
            if(users_ready >= Object.keys(users).length ) {
              done();
            }
          });
        }
      });
      it('should remove given user', function(done) {
        usersES.remove('bob', function() {
          client.indices.refresh({index:'users'}, function() {
            usersES.get_all_users(function(data) {
              var expected_users = {};
              expected_users.susan = users.susan;
              expect(data).toEqual(expected_users);
              done();
            });
          });
        });
      });
    });
    describe('when there is no such user', function() {
      var users = { 
        'bob':{
          name: 'bob',
          age: 17,
          sex: 'male'
        },
        'susan': {
          name: 'susan',
          age: 19
        }
      };
      beforeEach(function(done) {
        var users_ready = 0;
        for(key in users) {
          add_user(users[key],topics, function() {        
            users_ready += 1;
            if(users_ready >= Object.keys(users).length ) {
              done();
            }
          });
        }
      });
      it('should not remove any user', function(done) {
        usersES.remove('tom', function() {
          client.indices.refresh({index:'users'}, function() {
            usersES.get_all_users(function(data) {
              var expected_users = {};
              expected_users.susan = users.susan;
              expect(data).toEqual(users);
              done();
            });
          });
        });
      });
      it('should not raise exception', function(done) {
        expect(
          function() {
            usersES.remove('tom', function(){});
          }
        ).not.toThrow();
        done();
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
        usersES.add(user, topics, function(data) {
          expect(data).toEqual(user);
          done();
        })
      });
      it('should save the user', function(done) {
        usersES.add(user, topics, function(data) {
          usersES.get(user.name, function(data) {
            expect(data).toEqual(user);
            done();
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
      var user_2 = {
        name: 'bob',
        age: 25
      };
      beforeEach(function(done) {
        add_user(user, topics, function() {
          done();
        })
      });
      it('should return user with updated name', function(done) {
        usersES.get_all_users(function(users_before_adding) {
          expect(users_before_adding).toEqual({'bob': user});
          usersES.add(user_2, topics, function() {
            client.indices.refresh({index: 'users'}, function() {
              usersES.get_all_users(function(users_after_adding) {
                expect(users_after_adding).toEqual({'bob': user, 'bob_1': user_2});
                done();
              });
            });
          });
        });
      });
      it('should save the user with unique name', function(done) {
        usersES.add(user_2, topics,function(saved_user) {
          usersES.get(saved_user.name,function(returned_user) {
            expect(returned_user).toEqual(saved_user)
            done();
          });
        });
      });
    });
  });
  describe('.get', function() {
    describe('when user is already saved', function() {
      var users = { 
        'bob':{
          name: 'bob',
          age: 17,
          sex: 'male'
        },
        'susan': {
          name: 'susan',
          age: 19
        }
      };
      beforeEach(function(done) {
        var users_ready = 0;
        for(key in users) {
          add_user(users[key],topics, function() {        
            users_ready += 1;
            if(users_ready >= Object.keys(users).length ) {
              done();
            }
          });
        }
      });
      it('should return requested user', function(done) {
        usersES.get('bob', function(returned_user) {
          expect(returned_user).toEqual(users.bob);
          done();
        });
      });
    }); 
    describe('when there is not such user', function() {
      it('should return empty object', function(done) {
        usersES.get('bob', function(returned_user) {
          expect(returned_user).toEqual({});
          done();
        });
      });
      it('should not raise exception', function() {
        expect( function() {
          usersES.get('bob',function() {});
        }).not.toThrow();
      });
    });
  });
});