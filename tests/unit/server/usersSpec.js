describe('Users', function() {
  var Users = require('../../../app/server/models/users').Users;
  var elasticsearch = require('elasticsearch');

  var client = new elasticsearch.Client({
    host: 'localhost:9200'
  });
  var usersES = new Users(client);
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
      var user = {
        name: 'bob',
        age: 17,
        sex: 'male'
      };
      it('should save user', function(done) {
        usersES.save(user,topics,function() {
          client.indices.refresh({index: 'users'}, function() {
            client.search({index: 'users', type:'user'}, function(err,response) {
              expect(response.hits.total).toEqual(1);
              expect(response.hits.hits[0]._source).toEqual(user);
              done();
            });
          });
        });
      });
    });
  });
  describe('.getAllUsersByTopics', function() {
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
          usersES.getAllUsersByTopics(['topic1', 'topic2'], function(data) {
            expect(data.length).toEqual(2);
            done();
          });
        });
        it('should give higher score for those who match more topics', function(done) {
          usersES.getAllUsersByTopics(['topic1', 'topic2'], function(data) {
            for(var i = 0; i < data.length; i++) {
              if(data[i].name === 'bob'){
                var bob_score = data[i].score;
              }
              if(data[i].name === 'susan') {
                var susan_score = data[i].score;
              }
            }
            expect(bob_score).toBeGreaterThan(susan_score);
            done();
          });
        });
      });
      describe('and there are no users who have these topics', function() {
        it('should return empty object', function(done) {
          usersES.getAllUsersByTopics(['topic1'], function(data) {
            expect(data).toEqual({});
            done();
          });
        });
      });
    });
  });
  describe('.getUsersByTopics', function() {
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
      usersES.getUsersByTopics(['susan'],['topic3'], function(data) {
        expect(data.length).toEqual(1);
        done();
      });
    });
    it('he should get the same score as when getting the whole list', function(done) {
      usersES.getUsersByTopics(['bob'],['topic1', 'topic2'], function(data) {
        for(var i = 0; i < data.length; i++) {
          if(data[i].name === 'bob') {
            var bob_score = data[i].score;
          }
        }
        expect(bob_score).toEqual(0.2712221);
        done();
      });
    });
    it('he should get the same score as when getting the whole list', function(done) {
      usersES.getUsersByTopics(['susan'],['topic1', 'topic2'], function(data) {
        for(var i = 0; i < data.length; i++) {
          if(data[i].name === 'susan') {
            var susan_score = data[i].score;
          }
        }
        expect(susan_score).toEqual(0.028130025);
        done();
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
            client.search({index: 'users', type:'user'}, function(err,response) {
              expect(response.hits.total).toEqual(1);
              expect(response.hits.hits[0]._source).toEqual(users.susan);
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
            client.search({index: 'users', type:'user'}, function(err,response) {
              expect(response.hits.total).toEqual(2);
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

        client.search({index: 'users', type:'user'}, function(err,response) {
          expect(response.hits.total).toEqual(1);
          expect(response.hits.hits[0]._source).toEqual(user);
          usersES.add(user_2,topics, function() {
            client.indices.refresh({index: 'users'}, function() {
              client.search({index: 'users', type:'user'},function(err,response) {
                expect(response.hits.total).toEqual(2);
                expect(response.hits.hits[0]._source).toEqual(user);
                user_2.name = 'bob_1';
                expect(response.hits.hits[1]._source).toEqual(user_2);
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