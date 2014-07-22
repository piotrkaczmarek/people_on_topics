'use strict'

var app = angular.module('peopleOnTopicsApp', []);

app.directive('userProfile', function(){
  return {
    restrict: 'E',
    templateUrl: 'views/user_profile.html',
    controller: function() {
      var user = this;
      user.name = '';
      user.sex = '';
      user.age = '';
    },
    controllerAs: 'userCtrl'
  };

});