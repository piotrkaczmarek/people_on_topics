function UsersHandler (redis) {
  'use strict';

  this.handleGetUserList = function(req, res, next) {
    var UsersRedis = require('../usersRedis').UsersRedis;

    var usersRedis = new UsersRedis(redis);

    usersRedis.get_all_online(function(users) {
      return res.send(users);
    });
  };
};

module.exports = UsersHandler;