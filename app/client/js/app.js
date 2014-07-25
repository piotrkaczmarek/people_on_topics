'use strict'

var app = angular.module('peopleOnTopicsApp', []);

app.controller('userCtrl', function($http) {
  var user = this;
  user.name = '';
  user.sex = '';
  user.age = '';

  this.start = function() {
    $http.post('/sign_in', user).success(function(data) {
      user.name = data.user_name;
      console.log('Got: '+ data);
    });


  }

});

app.directive('userProfile', function(){
  return {
    restrict: 'E',
    templateUrl: 'views/user_profile.html',
    controller: 'userCtrl',
    controllerAs: 'user'
  };

});