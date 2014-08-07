app.directive('userTopics', function() {
  return {
    restrict: 'E',
    templateUrl: 'views/user_topics.html',
    controller: 'userTopicsCtrl'
  };
});