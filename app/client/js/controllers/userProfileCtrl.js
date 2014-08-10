app.controller('userProfileCtrl', function($http, $scope, socketFactory, usersFactory,currentUser) {
  $scope.current_user = {};

  $scope.start = function() {
    $scope.logged_in = true;
    var socket_connection_callback = function(err) {
      usersFactory.getUsers(function() {
        $scope.current_users = usersFactory.users;
      });
    };
    $http.post('/sign_in', $scope.current_user).
      success(function(data) {
        if(data.valid) {
          $scope.current_user.name = data.user_name;
          currentUser.setUser($scope.current_user);
          socketFactory.connect(data.socket_url,data.token,socket_connection_callback);
        } else {
          $scope.logged_in = false;
          $scope.errors = data.errors;
        }
      }).
      error(function() {
        $scope.logged_in = false;
      });
  };
});