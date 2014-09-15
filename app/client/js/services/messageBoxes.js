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
  var _closeMsgBox = function(userName) {
    for(var i = 0; i < _messageBoxes.length; i++) {
      if(_messageBoxes[i].user.name === userName) {
        _messageBoxes.splice(i,1);
        return;
      }
    }
  };

  $rootScope.$on('message', function(event,data) {
    var message = JSON.parse(data);
    _addMessage(message.from,message.from, message.body, function() {});
  });

  $rootScope.$on('leaves', function(event, name) {
    _closeMsgBox(name);
  });

  return {
    messageBoxes: _messageBoxes,
    create: _create,
    closeMsgBox: _closeMsgBox,
    addMessage: _addMessage
  };
});