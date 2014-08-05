app.factory('messageBoxesFactory', function(usersFactory, $rootScope) {
  var _messageBoxes = {};
  var _create = function(name) {
    if(_messageBoxes[name]) {
      return true;
    }
    var user = usersFactory.users[name];
    if(user) {
      _messageBoxes[name] = { 
        user: user,
        messages: []
      }
      return true;
    } else {
      return false;
    }
  };
  var _add_message = function(interlocutor, from, body) {
    if(!_messageBoxes[interlocutor]) {
      if(!_create(interlocutor)) {
        return false;
      }
    }
    _messageBoxes[interlocutor].messages.push({
      from: from,
      body: body
    });
  }


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