app.factory('usersFactory', function($http, $rootScope, $filter, $timeout, userTopicsFactory, currentUser) {
  var _users = [];
  var _newUsers = [];
  var waitingForUpdate = false;
  var _getUsers = function(topics, callback) {
    $http({method: 'GET', url:'/users',params: {topics: topics}}).
      success(function(data) {
        _users.length = 0;
        Array.prototype.push.apply(_users, data);
      });
  };
  var _removeUser = function(name) {
    var removeFrom = function(array) {
      for(var i = 0; i < array.length; i++) {
        if(array[i].name === name) {
          array.splice(i,1);
        }
      }
    };
    removeFrom(_users);
    removeFrom(_newUsers);
  };
  var _addUser = function(user) {
    _users.push(user);
  };
  var _getUser = function(name, callback) {
    var iterator = function(item, cb) {
      cb(item.name === name);
    };
    async.detect(_users, iterator,callback);
  };

  var updateNewUsers = function(topics, callback) {
    waitingForUpdate = false;
    var params = { users: angular.copy(_newUsers) ,topics: topics};
    _newUsers.length = 0;
    $http({method: 'GET', url: '/users/few', params: params}).
      success(function(data) {
        var iterator = function(item, cb) {
          _users.push(item);
          cb();
        };
        async.each(data, iterator,function(err) {
          if(err) throw err;
          callback();
        });
      });
  };
  var reorderList = function() {
    var orderedList = $filter('orderBy')(_users, 'score', true);
    _users.length = 0;
    Array.prototype.push.apply(_users, orderedList);
  };

  $rootScope.$on('joins', function(event, data) {
    var user = JSON.parse(data);
    if(userTopicsFactory.matches(user.topics) &&
     currentUser.getUser().name !== user.name) {
      _newUsers.push(user.name);
      
      if(!waitingForUpdate) {
        waitingForUpdate = true;
        $timeout(function() {
          updateNewUsers(userTopicsFactory.topics,reorderList);
        }, 1000);
      }
    }
  });

  $rootScope.$on('leaves', function(event, name) {
    _removeUser(name);
  });

  return {
    users: _users,
    getUsers: _getUsers,
    removeUser: _removeUser,
    addUser: _addUser,
    getUser: _getUser
  };
});