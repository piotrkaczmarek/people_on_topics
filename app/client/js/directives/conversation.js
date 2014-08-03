app.directive('conversation', function() {
  return {
    restrict: 'E',
    templateUrl: 'views/conversation.html',
    scope: {
      messageBox: '=box'
    },
    controller: 'conversationCtrl'
  };
});