var ContentHandler = require('./content');

module.exports = exports = function(app,db) {

  var contentHandler = new ContentHandler(db);

  app.get('/', contentHandler.displayMainPage);

}