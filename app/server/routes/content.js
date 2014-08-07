(function(){
  "use strict";

  var path = require('path');

  function ContentHandler() {
    this.displayMainPage = function(req, res, next) {
      return res.render(path.resolve('./app/client/views') + '/main_page.jade', {pageTitle: 'People on Topics'});
    };
  }

  module.exports = ContentHandler;
}());
