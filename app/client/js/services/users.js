app.factory('usersFactory', function($http, $rootScope) {
  var _users = {};
  var _getUsers = function(callback) {
    $http.get('/users').success(function(data) {
      for(var key in data) {
        _users[key] = data[key];
      }
      callback(_users);
    });
  };
  var _removeUser = function(name) {
    delete _users[name];
  };
  var _addUser = function(user) {
    if(user.name === undefined) {
      throw new Error('Factory users.addUser got incomplete user object');
    }
   _users[user.name] = user;
  };

  $rootScope.$on('joins', function(event, data) {
    var user = JSON.parse(data);
    _addUser(user);
  });

  $rootScope.$on('leaves', function(event, data) {
    _removeUser(data);
  });

  return {
    users: _users,
    getUsers: _getUsers,
    removeUser: _removeUser,
    addUser: _addUser
  };
});