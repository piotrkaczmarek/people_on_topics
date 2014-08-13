(function() {
  "use strict";

  var ContentHandler = require('./content'),
      SessionHander = require('./session'),
      UsersHandler = require('./users');

  module.exports = exports = function(app,usersDAO,socket_url) {

    var contentHandler = new ContentHandler();
    var sessionHandler = new SessionHander(usersDAO, socket_url);
    var usersHandler = new UsersHandler(usersDAO);

    app.get('/', contentHandler.displayMainPage);
    app.get('/users', usersHandler.handleGetUserList);
    app.get('/users/few', usersHandler.handleGetPartialUserList);
    app.post('/sign_in', sessionHandler.handleSignIn);

  };
}());
