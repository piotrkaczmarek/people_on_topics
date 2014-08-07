app.controller('userListCtrl', function($scope, $http, usersFactory, messageBoxesFactory) {  
  $scope.users = usersFactory.users;
  $scope.openMessageBox = function(name) {
    messageBoxesFactory.create(name);
  }
});
