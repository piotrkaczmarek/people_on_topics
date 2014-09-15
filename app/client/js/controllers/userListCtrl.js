app.controller('userListCtrl', function($scope, $http, usersFactory, messageBoxesFactory) {  
  $scope.users = usersFactory.users;
  $scope.openMessageBox = function(user) {
    messageBoxesFactory.create(user, function() {});
  };
});
