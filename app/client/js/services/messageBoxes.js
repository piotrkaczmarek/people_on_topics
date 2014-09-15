app.factory('messageBoxesFactory', function(usersFactory, $rootScope) {
  var _messageBoxes = {};
  var _create = function(user) {
    if(_messageBoxes[user.name]) {
      return true;
    }
    _messageBoxes[user.name] = { 
      user: user,
      messages: []
    };
    return true;
  };
  var _addMessage = function(interlocutor, from, body, callback) {
    if(!callback) {
      callback = function() {};
    }
    var appendMessage = function() {
      _messageBoxes[interlocutor].messages.push({
        from: from,
        body: body
      });
    };
    if(!_messageBoxes[interlocutor]) {
      usersFactory.getUser(interlocutor, function(user) {
        if(user) {
          _create(user);
          appendMessage();
        }
        callback();
      });
    } else {
      appendMessage();
      callback();
    }
  };

  $rootScope.$on('message', function(event,data) {
    var message = JSON.parse(data);
    _addMessage(message.from,message.from, message.body);
  });

  return {
    messageBoxes: _messageBoxes,
    create: _create,
    addMessage: _addMessage
  };
});