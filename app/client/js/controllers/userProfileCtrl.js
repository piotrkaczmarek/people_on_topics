app.controller('userProfileCtrl', function($http, $scope, socketFactory, usersFactory,currentUser, userTopicsFactory) {
  $scope.currentUser = {};

  $scope.start = function() {
    $scope.loggedIn = true;
    var socketConnectionCallback = function(err) {
      usersFactory.getUsers(userTopicsFactory.topics, function() {});
    };
    var successCallback = function(data) {
      $scope.currentUser.name = data.user_name;
      currentUser.setUser($scope.currentUser);
      socketFactory.connect(data.token,socketConnectionCallback);
    };

    if(userTopicsFactory.topics.length === 0) {
      $scope.loggedIn = false;
      $scope.errors = {topics: 'You need to choose at least one topic'};
    } else {
      $scope.errors = {};
      $http.post('/sign_in', {user:$scope.currentUser, topics: userTopicsFactory.topics}).
        success(function(data) {
          if(data.valid) {
            successCallback(data);
          } else {
            $scope.loggedIn = false;
            $scope.errors = data.errors;
          }
        }).
        error(function() {
          $scope.loggedIn = false;
        }); 
    }
  };
});