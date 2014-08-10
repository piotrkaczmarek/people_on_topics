

function SessionHander (usersDAO) {
  'use strict';
  var UserValidator = require('../lib/userValidator'),
    Jwt = require('jsonwebtoken');

  this.handleSignIn = function(req, res, next) {

    var user = req.body;   
    var validation = UserValidator.validate(user);

    if(validation.valid) {
      usersDAO.add(user, function(data) {
        validation.user_name = data.name;
        validation.token = Jwt.sign(data, 'secret');
        return.send(validation);
      });
    } else {
      return res.send(validation);
    }
  };
}

module.exports = SessionHander;