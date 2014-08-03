app.controller('conversationCtrl', function($scope) {

  $scope.send = function() {
    console.log('sending ',this.new_message,' to ', this.messageBox.user);
  }
});