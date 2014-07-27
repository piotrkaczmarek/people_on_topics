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

    io.on('connection', function(socket) {
      var user = socket.decoded_token;
      console.log("Socket connected to: ",user);
      redisSubscriber.subscribe('joins', 'leaves');
      redisSubscriber.on('message', function(channel, message) {
        debugger;

      });
      redisPublisher.publish('joins', user.name);


      

      socket.on('disconnect', function() {
        console.log("Socket disconnected from: ",user);
        users.remove(user.name, function() {
          redisPublisher.publish('leaves', user.name);
        });
      });


    });

  }

}());