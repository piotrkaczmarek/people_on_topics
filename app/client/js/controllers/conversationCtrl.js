app.controller('conversationCtrl', function($scope, socketFactory,messageBoxesFactory, currentUser) {
  var user = $scope.user;

  $scope.send = function() {
    socketFactory.send_message(this.messageBox.user.name, this.new_message);
    var user = currentUser.getUser();
    messageBoxesFactory.add_message(this.messageBox.user.name, user.name, this.new_message);
  }
});