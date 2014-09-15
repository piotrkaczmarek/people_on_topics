app.controller('userTopicsCtrl', function($scope, userTopicsFactory) {
  $scope.topics = userTopicsFactory.topics;

  $scope.addTopic = function() {
    userTopicsFactory.addTopic($scope.new_topic);
    $scope.new_topic = "";
  };

});