app.controller('userTopicsCtrl', function($scope, userTopicsFactory) {
  $scope.topics = userTopicsFactory.topics;

  $scope.add_topic = function() {
    userTopicsFactory.add_topic($scope.new_topic);
    $scope.new_topic = "";
  };

});