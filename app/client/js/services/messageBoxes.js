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
  var _add_message = function(interlocutor, from, body, callback) {
    if(!callback) {
      callback = function() {};
    }
    var append_message = function() {
      _messageBoxes[interlocutor].messages.push({
        from: from,
        body: body
      });
    };
    if(!_messageBoxes[interlocutor]) {
      usersFactory.getUser(interlocutor, function(user) {
        if(user) {
          _create(user);
          append_message();
        }
        callback();
      });
    } else {
      append_message();
      callback();
    }
  };

  $rootScope.$on('message', function(event,data) {
    var message = JSON.parse(data);
    _add_message(message.from,message.from, message.body);
  });

  return {
    messageBoxes: _messageBoxes,
    create: _create,
    add_message: _add_message
  };
});