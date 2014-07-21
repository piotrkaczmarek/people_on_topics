var path = require('path');

function ContentHandler(db) {
  "use strict"

  this.displayMainPage = function(req, res, next) {
    "use strict";
    
    return res.render(path.resolve('./app/client') + '/main_page.jade')
  }
}

module.exports = ContentHandler;