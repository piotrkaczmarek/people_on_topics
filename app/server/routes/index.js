(function() {
  "use strict"

  var ContentHandler = require('./content')
    , SessionHander = require('./session');

  module.exports = exports = function(app,redis) {

    var contentHandler = new ContentHandler();
    var sessionHandler = new SessionHander(redis);

    app.get('/', contentHandler.displayMainPage);

    app.post('/sign_in', sessionHandler.handleSignIn);

  }
}());
