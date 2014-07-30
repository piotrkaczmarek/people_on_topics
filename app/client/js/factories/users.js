app.factory('users', function($http) {
  var _users = {};
  var _getUsers = function(callback) {
    $http.get('/users').success(function(data) {
      for(key in data) {
        _users[key] = data[key];
      }
      callback(_users);
    });
  };
  var _removeUser = function(name) {
    delete _users[name];
  }
  var _addUser = function(user) {
   _users[user.name] = user;
  }
  return {
    users: _users,
    getUsers: _getUsers,
    removeUser: _removeUser,
    addUser: _addUser
  }
});