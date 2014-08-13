app.factory('usersFactory', function($http, $rootScope, userTopicsFactory) {
  var _users = [];
  var _getUsers = function(topics, callback) {
    $http({method: 'GET', url:'/users',params: {topics: topics}}).success(function(data) {
      for(var key in data) {
        _users.push(data[key]);
      }
      callback(_users);
    });
  };
  var _removeUser = function(name) {
    for(var i = 0; i < _users.length; i++) {
      if(_users[i].name === name) {
        _users.splice(i,1);
      }
    }
  };
  var _addUser = function(user) {
    _users.push(user);
  };
  var _getUser = function(name) {
    for(var i = 0; i < _users.length; i++) {
      if(_users[i].name === name) {
        return _users[i];
      }
    }
    return false;
  };
  $rootScope.$on('joins', function(event, data) {
    var user = JSON.parse(data);
    if(userTopicsFactory.matches(user.topics)) {
      user.score = 0;
      _addUser(user);
    }
  });

  $rootScope.$on('leaves', function(event, data) {
    _removeUser(data);
  });

  return {
    users: _users,
    getUsers: _getUsers,
    removeUser: _removeUser,
    addUser: _addUser,
    getUser: _getUser
  };
});