describe('messageBoxesFactory', function() {
  describe('.create', function() {
    describe('when there is a user with given name', function() {
      var factory;
      var users = { 'bob':
                    { name: 'bob',
                    age: 17}
                  }
      var user = users.bob;
      beforeEach(function() {
        var usersFactory = {
          users: users
        };
        module('peopleOnTopicsApp');
        module(function($provide) {
          $provide.value('usersFactory', usersFactory)
        });

        inject(function(messageBoxesFactory) {
          factory = messageBoxesFactory;
        });
      });
      it('should create new conversation', function() {
        factory.create(user.name);
        var boxes = Object.keys(factory.messageBoxes);
        expect(boxes.length).toEqual(1);
      });
      it('should add user data to conversation', function() {
        factory.create(user.name);
        expect(factory.messageBoxes[user.name].user).toEqual(user);
      });
    });
    describe('when there is no such user', function() {
      var factory;
      beforeEach(function() {
        module('peopleOnTopicsApp');
        inject(function(messageBoxesFactory) {
          factory = messageBoxesFactory;
        });
      });
      it('should not open new message box', function() {
        factory.create('Johnny');
        var boxes = Object.keys(factory.messageBoxes);
        expect(boxes.length).toEqual(0);
      });
    });
  });
});