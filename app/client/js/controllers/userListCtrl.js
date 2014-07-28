app.controller('userListCtrl', function($scope, $http, users) {  
  users.getUsers(function(data){
    $scope.users = data;
  });
});
