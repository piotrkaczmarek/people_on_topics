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
  var _add_message = function(interlocutor, from, body) {
    if(!_messageBoxes[interlocutor]) {
      var user = usersFactory.getUser(interlocutor);
      if(user) {
        _create(user)
      } else {
        return false;
      }
    }
    _messageBoxes[interlocutor].messages.push({
      from: from,
      body: body
    });
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