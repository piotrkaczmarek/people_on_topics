app.controller('userListCtrl', function($scope, $http, usersFactory, messageBoxesFactory) {  
  usersFactory.getUsers(function() {
    $scope.users = usersFactory.users;
  });
  $scope.openMessageBox = function(name) {
    messageBoxesFactory.create(name);
  }
});
