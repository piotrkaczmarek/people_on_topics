(function() {
  "use strict";

  var ContentHandler = require('./content'),
      SessionHander = require('./session'),
      UsersHandler = require('./users');

  module.exports = exports = function(app,usersDAO, tokenSecret) {

    var contentHandler = new ContentHandler();
    var sessionHandler = new SessionHander(usersDAO, tokenSecret);
    var usersHandler = new UsersHandler(usersDAO);

    app.get('/', contentHandler.displayMainPage);
    app.get('/users', usersHandler.handleGetUserList);
    app.get('/users/few', usersHandler.handleGetPartialUserList);
    app.post('/sign_in', sessionHandler.handleSignIn);

  };
}());
