(function() {
  'use strict';
  module.exports = exports = function(redisPublisher, io, socketIoJwt, tokenSecret) {

    io.use(socketIoJwt.authorize({
      secret: tokenSecret,
      handshake: true
    }));
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
        redisPublisher.publish('leaves', user.name);
      });
    });
  };
}());