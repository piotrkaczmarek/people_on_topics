(function(){
  "use strict"

  var path = require('path');

  function ContentHandler(db) {
    this.displayMainPage = function(req, res, next) {
      return res.render(path.resolve('./app/client') + '/main_page.jade')
    }
  }

  module.exports = ContentHandler;
}());
