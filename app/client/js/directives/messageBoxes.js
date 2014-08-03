app.directive('messageBoxes', function() {
  return {
    restrict: 'E',
    templateUrl: 'views/message_boxes.html',
    controller: 'messageBoxesCtrl',
    controllerAs: 'messageBoxes'
  };
});