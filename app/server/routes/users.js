function UsersHandler (usersDAO) {
  'use strict';

  this.handleGetUserList = function(req, res, next) {
    var topics = [].concat(req.query.topics);
    usersDAO.getAllUsersByTopics(topics,function(users) {
      return res.send(users);
    });
  };
  this.handleGetPartialUserList = function(req,res,next) {
    var usernames = [].concat(req.query.users);
    var topics = [].concat(req.query.topics);
    usersDAO.getUsersByTopics(usernames, topics, function(users) {
      return res.send(users);
    });
  };
}

module.exports = UsersHandler;