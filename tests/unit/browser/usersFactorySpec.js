describe('usersFactory', function() {
  var factory;
  var topics = ['sports'];
  beforeEach(function() {
    module('peopleOnTopicsApp');
    inject(function(usersFactory) {
      factory = usersFactory;
    })
  });
  describe('.users', function() {
    describe('when there are no users', function() {
      it('should return empty object', function() {
        expect(factory.users).toEqual({});
      });
    });
  });

  describe('.getUsers', function() {
    var $httpBackend;
    beforeEach(inject(function($injector) {
      $httpBackend = $injector.get('$httpBackend');      
    }));
    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
    describe('when there is one user', function() {
      var users = [
        {
          name: 'bob',
          age: 17
        }
      ]
      it('should send request to server', function() {
        $httpBackend.expect('GET', '/users?topics='+topics[0]).respond(users);
        factory.getUsers(topics, function(){});
        $httpBackend.flush();
      });
      it('should return one user', function() {
        $httpBackend.when('GET','/users?topics='+topics[0]).respond(users);
        factory.getUsers(topics, function(data) {
          expect(data).toEqual(users);
        });
        $httpBackend.flush();
      });
      it('should update users data', function() {
        $httpBackend.when('GET', '/users?topics='+topics[0]).respond(users);
        factory.getUsers(topics, function(data) {
          expect(factory.users).toEqual(users);
        });
        $httpBackend.flush();
      });
    });
  });
  describe('.addUser', function() {
    var new_user = {
      name: 'bob',
      age: 17,
      sex: 'male'
    };
    it('should add a new user', function() {
      factory.addUser(new_user);
      expect(factory.users).toEqual([new_user]);
    });
  });
  describe('.removeUser', function() {
    var $httpBackend;
    var users = [
      {
        name: 'bob',
        age: 17
      },
      {
        name: 'susan',
        sex: 'female'
      }
    ]
    beforeEach(inject(function($injector) {
      $httpBackend = $injector.get('$httpBackend');      
    }));
    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });
    describe('when there are two users', function() {
      it('should remove one user', function() {
        $httpBackend.when('GET', '/users?topics='+topics[0]).respond(users);
        factory.getUsers(topics, function(data) {
          factory.removeUser('bob');
          expect(factory.users).toEqual([users[1]])
        });
        $httpBackend.flush();
      });
    });
    describe('when there is no user with given name', function() {
      it('should not delete any user',function() {
        $httpBackend.when('GET', '/users?topics='+topics[0]).respond(users);
        factory.getUsers(topics, function(data) {
          factory.removeUser('juliet');
          expect(factory.users).toEqual(users);
        });
        $httpBackend.flush();
      });
      it('should not throw any exception', function() {
        expect(factory.removeUser, 'juliet').not.toThrow();
      });
    });
    describe('when there are no users', function() {
      it('should not throw any exception', function() {
        expect(factory.removeUser, 'john').not.toThrow();
      });
      it('should return empty object', function() {
        factory.removeUser('john');
        expect(factory.users).toEqual({});
      });
    });
  });
  describe('.getUser', function() {
    describe('when user is on the list', function() {
      beforeEach(function() {
        factory.addUser({name: 'bob', age: 20});
        factory.addUser({name: 'susan'});
      });
      it('should find user', function() {
        factory.getUser('bob', function(data) {
          expect(data).toEqual({name: 'bob', age: 20});
        });
      });
    });
    describe('when user is not on the list', function() {
      beforeEach(function() {
        factory.addUser({name: 'bob', age: 20});
        factory.addUser({name: 'susan'});
      });
      it('should return false', function() {
        factory.getUser('john', function(data) {
          expect(data).toEqual(undefined);
        });
      });
    });
  });
});