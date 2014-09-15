app.controller('conversationCtrl', function($scope, socketFactory,messageBoxesFactory, currentUser) {
  var user = $scope.user;

  $scope.send = function() {
    socketFactory.sendMessage(this.messageBox.user.name, this.newMessage);
    var user = currentUser.getUser();
    messageBoxesFactory.addMessage(this.messageBox.user.name, user.name, this.newMessage, function() {
      this.newMessage = "";
    });
  };
});