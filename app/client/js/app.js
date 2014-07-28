'use strict'

var app = angular.module('peopleOnTopicsApp', []);

app.factory('socket', function() {
  var _socket;
  var _connect = function(token) {
    _socket = io.connect('http://0.0.0.0:8080', {
      'query': 'token='+token
    }).on('connect', function() {
      console.log('Socket authenticated');
      return;
    }).on('joins', function(user) {
      console.log(user,' joined!');
    }).on('leaves', function(user) {
      console.log(user,' left!');
    });
  };
  return {
    connect: _connect
  }
});

app.factory('users', function($http) {
  var _getUsers = function(callback) {
    $http.get('/users').success(function(data) {
      callback(data);
    });
  };
  return {
    getUsers: _getUsers
  }
});

app.controller('userProfileCtrl', function($http, $scope, users, socket) {
  var user = this;
  user.name = '';
  user.sex = '';
  user.age = '';
  this.start = function() {
    $http.post('/sign_in', user).success(function(data) {
      user.name = data.user_name;
      socket.connect(data.token);
      users.getUsers(function(data){
        $scope.users = data;
      });
    });
  }
});

app.directive('userProfile', function(){
  return {
    restrict: 'E',
    templateUrl: 'views/user_profile.html',
    controller: 'userProfileCtrl',
    controllerAs: 'user'
  };
});

app.controller('userListCtrl', function($scope, $http, users) {  
  users.getUsers(function(data){
    $scope.users = data;
  });
});


app.directive('userList', function() {
  return {
    restrict: 'E',
    templateUrl: 'views/user_list.html',
    controller: 'userListCtrl',
    controllerAs: 'userList'
  };
});