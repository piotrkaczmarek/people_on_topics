app.controller('userProfileCtrl', function($http, $scope, users, socket) {
  var user = this;
  user.name = '';
  user.sex = '';
  user.age = '';
  this.start = function() {
    $http.post('/sign_in', user).success(function(data) {
      user.name = data.user_name;
      socket.connect(data.token);
      users.getUsers(function(data){
        $scope.users = data;
      });
    });
  }
});