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
      io.connect('http://0.0.0.0:8080', {
        'query': 'token='+data.token
      }).on('connect', function() {
        console.log('Socket authenticated');
        return;
      });
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