app.directive('userList', function() {
  return {
    restrict: 'E',
    templateUrl: 'views/user_list.html',
    controller: 'userListCtrl',
    controllerAs: 'userList'
  };
});