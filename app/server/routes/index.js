(function() {
  "use strict";

  var ContentHandler = require('./content'),
      SessionHander = require('./session'),
      UsersHandler = require('./users');

  module.exports = exports = function(app,usersDAO) {

    var contentHandler = new ContentHandler();
    var sessionHandler = new SessionHander(usersDAO);
    var usersHandler = new UsersHandler(usersDAO);

    app.get('/', contentHandler.displayMainPage);
    app.get('/users', usersHandler.handleGetUserList);
    app.post('/sign_in', sessionHandler.handleSignIn);

  };
}());
