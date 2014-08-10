

function SessionHander (redis) {
  'use strict';

  this.handleSignIn = function(req, res, next) {
    var UserValidator = require('../lib/userValidator'),
      Jwt = require('jsonwebtoken'),
      UsersRedis = require('../usersRedis').UsersRedis,
      users = new UsersRedis(redis);

    var user = req.body;   
    var validation = UserValidator.validate(user);

    if(validation.valid) {
      users.add(user, function(data) {
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