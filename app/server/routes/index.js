(function() {
  "use strict"

  var ContentHandler = require('./content')
    , SessionHander = require('./session')
    , UsersHandler = require('./users');

  module.exports = exports = function(app,redis) {

    var contentHandler = new ContentHandler();
    var sessionHandler = new SessionHander(redis);
    var usersHandler = new UsersHandler(redis);

    app.get('/', contentHandler.displayMainPage);
    app.get('/users', usersHandler.handleGetUserList);
    app.post('/sign_in', sessionHandler.handleSignIn);

  }
}());
