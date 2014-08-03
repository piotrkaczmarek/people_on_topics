app.controller('messageBoxesCtrl', function($scope, messageBoxesFactory) {
  $scope.boxes = messageBoxesFactory.messageBoxes;
});