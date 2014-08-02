app.controller('userProfileCtrl', function($http, $scope, socketFactory) {
  $scope.user = {};

  $scope.start = function() {
    $http.post('/sign_in', $scope.user).success(function(data) {
      $scope.user.name = data.user_name;
      socketFactory.connect(data.token);
      $('.dropdown.open .dropdown-toggle').dropdown('toggle');
    });
  }
});