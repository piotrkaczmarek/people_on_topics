var path = require('path');

function ContentHandler(db) {
  "use strict"

  this.displayMainPage = function(req, res, next) {
    "use strict";
    
    return res.sendfile(path.resolve('./app/client') + '/index.html');
  }
}

module.exports = ContentHandler;