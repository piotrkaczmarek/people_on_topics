app.factory('users', function($http) {
  var _getUsers = function(callback) {
    $http.get('/users').success(function(data) {
      callback(data);
    });
  };
  return {
    getUsers: _getUsers
  }
});