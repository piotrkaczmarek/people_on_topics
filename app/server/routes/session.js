

function SessionHander (redis) {
  'use strict'


  var UsersRedis = require('../usersRedis').UsersRedis;
  var users = new UsersRedis(redis);


  this.handleSignIn = function(req, res, next) {
    var UserValidator = require('../lib/userValidator')
    , Jwt = require('jsonwebtoken')
    , UsersRedis = require('../usersRedis').UsersRedis
    , users = new UsersRedis(redis);

    var user = req.body;   
    var validation = UserValidator.validate(user);

    if(validation.valid) {
      users.get_unique_name(user.name, function(unique_name) {
        user.name = unique_name;
        users.save(user,function() {
          validation.user_name = user.name;
          validation.token = Jwt.sign(user, 'secret');
          return res.send(validation);
        });
      });
    } else {
      return res.send(validation);
    }
  }

}

module.exports = SessionHander;