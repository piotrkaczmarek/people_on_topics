app.controller('userProfileCtrl', function($http, $scope, socketFactory, usersFactory,currentUser) {
  $scope.user = {};

  $scope.start = function() {
    $http.post('/sign_in', $scope.user).success(function(data) {
      $scope.user.name = data.user_name;
      currentUser.setUser($scope.user);
      
      socketFactory.connect(data.token);
      $('.dropdown.open .dropdown-toggle').dropdown('toggle');
      usersFactory.getUsers(function() {
        $scope.users = usersFactory.users;
      });
    });
  }
});