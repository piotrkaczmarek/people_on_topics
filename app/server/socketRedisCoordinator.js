(function() {
  'use strict';
  module.exports = exports = function(redisSubscriber, usersDAO, io) {

    redisSubscriber.subscribe('joins', 'leaves', 'message_sent');
    
    redisSubscriber.on('message', function(channel, message) {
      var add_user = function(message) {
        io.sockets.emit('joins', message);
      };
      var remove_user = function(message) {
        usersDAO.remove(message, function() {
          console.log('Removed ',message);
          io.sockets.emit('leaves', message);
        });
      };
      var send_message = function(message) {
        var recipient = JSON.parse(message).to;
        for(var socket in io.sockets.connected) {
          if(io.sockets.connected.hasOwnProperty(socket) &&
           io.sockets.connected[socket].decoded_token.name === recipient) {
            console.log('Sending to ',recipient,'message:\n\t',message);
            io.sockets.connected[socket].emit('message', message);
          }
        }
      };
      console.log('redisSubscriber got: ',message," on: ",channel);
      if(channel === 'joins') {
        add_user(message);
      } else if(channel === 'leaves') {
        remove_user(message);
      } else if(channel === 'message_sent') {
        send_message(message);
      }
    });
  };
}());