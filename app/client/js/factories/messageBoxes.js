app.factory('messageBoxesFactory', function(usersFactory) {
  var _messageBoxes = {};
  var _create = function(name) {
    var user = usersFactory.users[name];
    if(user) {
      _messageBoxes[name] = { 
        user: user,
        messages: []
      }
    }
  };
  return {
    messageBoxes: _messageBoxes,
    create: _create 
  };
});