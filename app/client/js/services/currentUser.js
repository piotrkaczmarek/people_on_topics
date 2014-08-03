app.service('currentUser', function() {
  var _user = {};
  this.setUser = function(user) {
    _user = user; 
  }
  this.getUser = function(user)  {
    return _user;
  }
});