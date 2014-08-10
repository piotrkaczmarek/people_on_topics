function UsersHandler (usersDAO) {
  'use strict';

  this.handleGetUserList = function(req, res, next) {
    usersDAO.get_all_online(function(users) {
      return res.send(users);
    });
  };
}

module.exports = UsersHandler;