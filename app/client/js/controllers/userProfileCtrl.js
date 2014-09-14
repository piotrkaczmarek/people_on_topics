app.controller('userProfileCtrl', function($http, $scope, socketFactory, usersFactory,currentUser, userTopicsFactory) {
  $scope.current_user = {};

  $scope.start = function() {
    $scope.logged_in = true;
    var socketConnectionCallback = function(err) {
      usersFactory.getUsers(userTopicsFactory.topics, function() {});
    };
    var successCallback = function(data) {
      $scope.current_user.name = data.user_name;
      currentUser.setUser($scope.current_user);
      socketFactory.connect(data.token,socketConnectionCallback);
    };

    if(userTopicsFactory.topics.length === 0) {
      $scope.logged_in = false;
      $scope.errors = {topics: 'You need to choose at least one topic'};
    } else {
      $scope.errors = {};
      $http.post('/sign_in', {user:$scope.current_user, topics: userTopicsFactory.topics}).
        success(function(data) {
          if(data.valid) {
            successCallback(data);
          } else {
            $scope.logged_in = false;
            $scope.errors = data.errors;
          }
        }).
        error(function() {
          $scope.logged_in = false;
        }); 
    }
  };
});