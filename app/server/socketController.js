(function() {
  'use strict';
  module.exports = exports = function(server, redisPublisher, redisSubscriber) {

    var io = require('socket.io').listen(server)
    ,   socketIoJwt = require('socketio-jwt')
    ,   UsersRedis = require('./usersRedis').UsersRedis
    ,   users = new UsersRedis(redisPublisher);

        
    io.use(socketIoJwt.authorize({
      secret: 'secret',
      handshake: true
    }));

    redisSubscriber.subscribe('joins', 'leaves', 'message_sent');
    
    redisSubscriber.on('message', function(channel, message) {
      console.log('redisSubscriber got: ',message," on: ",channel);
      if(channel === 'joins') {
        io.sockets.emit('joins', message);
      } else if(channel === 'leaves') {
        users.remove(message, function() {
          console.log('Removed ',message);
          io.sockets.emit('leaves', message);
        });
      } else if(channel === 'message_sent') {
          var recipient = JSON.parse(message).to;
          for(var socket in io.sockets.connected) {
            if(io.sockets.connected.hasOwnProperty(socket) &&
             io.sockets.connected[socket].decoded_token.name === recipient) {
              console.log('Sending to ',recipient,'message:\n\t',message);
              io.sockets.connected[socket].emit('message', message);
            }
          }
      }
    });

    io.on('connection', function(socket) {
      var user = socket.decoded_token;
      console.log("Socket connected to: ",user);
      delete user.iat;
      redisPublisher.publish('joins', JSON.stringify(user)); 

      socket.on('message', function (data) {
        data.from = user.name;
        redisPublisher.publish('message_sent', JSON.stringify(data));
      });

      socket.on('disconnect', function() {
        console.log("Socket disconnected from: ",user);
        users.remove(user.name, function() {
          redisPublisher.publish('leaves', user.name);
        });
      });


    });

  }

}());