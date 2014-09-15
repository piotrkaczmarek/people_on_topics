app.factory('messageBoxesFactory', function(usersFactory, $rootScope) {
  var _messageBoxes = [];
  var getUserMsgBox = function(userName, callback) {
    var iterator = function(item, cb) {
      cb(item.user.name === userName);
    };
    async.detect(_messageBoxes, iterator, callback);
  };
  var _create = function(user, callback) {
    var createNewUserMsgBox = function(newUser) {
      var index = _messageBoxes.push({
        user: newUser,
        messages: []
      });
      return _messageBoxes[index - 1];
    };
    getUserMsgBox(user.name, function(userMsgBox) {
      if(!userMsgBox) {
        userMsgBox = createNewUserMsgBox(user);
      }
      callback(userMsgBox);
    });
  };
  var _addMessage = function(interlocutor, from, body, callback) {
    var appendMessage = function(msgBox) {
      msgBox.messages.push({
        from: from,
        body: body
      });
    };
    getUserMsgBox(interlocutor, function(userMsgBox) {
      if(!userMsgBox) {
        usersFactory.getUser(interlocutor, function(user) {
          if(user) {
            _create(user, function(userMsgBox) {
              appendMessage(userMsgBox);
            });
          }
          callback();
        });
      } else {
        appendMessage(userMsgBox);
        callback();
      }
    });
  };

  $rootScope.$on('message', function(event,data) {
    var message = JSON.parse(data);
    _addMessage(message.from,message.from, message.body, function() {});
  });

  return {
    messageBoxes: _messageBoxes,
    create: _create,
    addMessage: _addMessage
  };
});