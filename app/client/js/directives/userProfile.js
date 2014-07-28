app.directive('userProfile', function(){
  return {
    restrict: 'E',
    templateUrl: 'views/user_profile.html',
    controller: 'userProfileCtrl',
    controllerAs: 'user'
  };
});
