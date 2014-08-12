app.controller('userProfileCtrl', function($http, $scope, socketFactory, usersFactory,currentUser, userTopicsFactory) {
  $scope.current_user = {};

  $scope.start = function() {
    $scope.logged_in = true;
    var socket_connection_callback = function(err) {
      usersFactory.getUsers(userTopicsFactory.topics, function() {
        $scope.current_users = usersFactory.users;
      });
    };

    if(Object.keys(userTopicsFactory.topics).length === 0) {
      $scope.logged_in = false;
      $scope.errors = {topics: 'You need to choose at least one topic'};
    } else {
      $scope.errors = {};
      $http.post('/sign_in', {user:$scope.current_user, topics: userTopicsFactory.topics}).
        success(function(data) {
          if(data.valid) {
            $scope.current_user.name = data.user_name;
            currentUser.setUser($scope.current_user);
            socketFactory.connect(data.socket_url,data.token,socket_connection_callback);
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