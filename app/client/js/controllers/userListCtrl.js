app.controller('userListCtrl', function($scope, $http, usersFactory) {  
  usersFactory.getUsers(function() {
    $scope.users = usersFactory.users;
  });
});
