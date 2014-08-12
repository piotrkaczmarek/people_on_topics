function UsersHandler (usersDAO) {
  'use strict';

  this.handleGetUserList = function(req, res, next) {
    var topics = [].concat(req.query.topics);
    usersDAO.get_all_users_by_topics(topics,function(users) {
      return res.send(users);
    });
  };
}

module.exports = UsersHandler;