

function SessionHander (usersDAO, tokenSecret) {
  'use strict';
  var UserValidator = require('../lib/userValidator'),
    Jwt = require('jsonwebtoken');

  this.handleSignIn = function(req, res, next) {

    var user = req.body.user;   
    var topics = req.body.topics;
    var validation = UserValidator.validate(user);

    if(validation.valid) {
      usersDAO.add(user, topics, function(data) {
        validation.user_name = data.name;
        validation.token = Jwt.sign(data, tokenSecret);
        return res.send(validation);
      });
    } else {
      return res.send(validation);
    }
  };
}

module.exports = SessionHander;