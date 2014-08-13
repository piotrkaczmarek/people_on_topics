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
        factory.create(user);
        var boxes = Object.keys(factory.messageBoxes);
        expect(boxes.length).toEqual(1);
      });
      it('should add user data to conversation', function() {
        factory.create(user);
        expect(factory.messageBoxes[user.name].user).toEqual(user);
      });
      describe('when the conversation has already been started', function() {
        beforeEach(function() {
          factory.create(user);
          factory.add_message(user.name,user.name, 'Hello!');
        });
        it('should not delete previous messages', function () {
          factory.create(user);
          expect(factory.messageBoxes[user.name].messages).toEqual([{from: user.name, body: 'Hello!'}]);
        });
      });
    });
  });
  describe('.add_message', function() {
    describe('when receiving', function() {
      describe('when there conversation with given person has already been started', function() {
        var factory;
        var users = { 'Johnny':
                      { name: 'Johnny',
                      age: 17}
                    }
        var user = users.Johnny;
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
          factory.create(user);
        });
        it('should append new message', function() {
          factory.add_message('Johnny','Johnny', 'Hello Bob!');
          expect(factory.messageBoxes['Johnny'].messages.length).toEqual(1);
        });
        it('should save sender name', function() {
          factory.add_message('Johnny','Johnny', 'Hello Bob!');
          expect(factory.messageBoxes['Johnny'].messages[0].from).toEqual('Johnny');
        });
        it('should save message body', function() {
          factory.add_message('Johnny','Johnny', 'Hello Bob!');
          expect(factory.messageBoxes['Johnny'].messages[0].body).toEqual('Hello Bob!');
        });
      });
      describe('when there was no conversation with given person', function() {
        describe('but that person is logged in', function() {
          var factory;
          var users = { 'Johnny':
                        { name: 'Johnny',
                        age: 17}
                      }
          beforeEach(function() {
            var usersFactory = {
              getUser: function(name) {
                return users.Johnny;
              }
            };
            module('peopleOnTopicsApp');
            module(function($provide) {
              $provide.value('usersFactory', usersFactory)
            });
            inject(function(messageBoxesFactory) {
              factory = messageBoxesFactory;
            });
          });
          it('should append new message', function() {
            factory.add_message('Johnny','Johnny', 'Hello Bob!');
            expect(factory.messageBoxes['Johnny'].messages.length).toEqual(1);
          });
          it('should save sender name', function() {
            factory.add_message('Johnny','Johnny', 'Hello Bob!');
            expect(factory.messageBoxes['Johnny'].messages[0].from).toEqual('Johnny');
          });
          it('should save message body', function() {
            factory.add_message('Johnny','Johnny', 'Hello Bob!');
            expect(factory.messageBoxes['Johnny'].messages[0].body).toEqual('Hello Bob!');
          });
        });
      });
    });
    describe('when sending', function() {
      describe('when there conversation with given person has already been started', function() {
        var factory;
        var users = { 'Johnny':
                      { name: 'Johnny',
                      age: 17}
                    }
        var user = users.Johnny;
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
          factory.create(user);
        });
        it('should append new message', function() {
          factory.add_message('Johnny','Bob', 'Hello Johnny!');
          expect(factory.messageBoxes['Johnny'].messages.length).toEqual(1);
        });
        it('should save sender name', function() {
          factory.add_message('Johnny','Bob', 'Hello Johnny!');
          expect(factory.messageBoxes['Johnny'].messages[0].from).toEqual('Bob');
        });
        it('should save message body', function() {
          factory.add_message('Johnny','Bob', 'Hello Johnny!');
          expect(factory.messageBoxes['Johnny'].messages[0].body).toEqual('Hello Johnny!');
        });
      });
    });
  });
});