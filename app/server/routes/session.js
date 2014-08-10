

function SessionHander (usersDAO, socket_url) {
  'use strict';
  var UserValidator = require('../lib/userValidator'),
    Jwt = require('jsonwebtoken');

  this.handleSignIn = function(req, res, next) {

    var user = req.body;   
    var topics = []; //empty placeholder for now
    var validation = UserValidator.validate(user);

    if(validation.valid) {
      usersDAO.add(user, topics, function(data) {
        validation.user_name = data.name;
        validation.token = Jwt.sign(data, 'secret');
        validation.socket_url = socket_url;
        return res.send(validation);
      });
    } else {
      return res.send(validation);
    }
  };
}

module.exports = SessionHander;