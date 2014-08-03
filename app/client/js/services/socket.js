app.factory('socketFactory', function($rootScope) {
  var _socket;
  var _connect = function(token) {
    _socket = io.connect('http://0.0.0.0:8080', {
      'query': 'token='+token
    })
    registerEvents(_socket);
  };
  var _send_message = function(recipient, body) {
    _socket.emit('message', 
      {
        to: recipient,
        body: body
      }
    );
    console.log('sending ',body,' to ', recipient);
  }
  var registerEvents = function(socket) {
    socket.on('connect', function() {
      console.log('Socket authenticated');
    });

    socket.on('joins', function(data) {
      $rootScope.$apply(function() {
        $rootScope.$broadcast('joins', data);
      });
    });

    socket.on('leaves', function(data) {
      $rootScope.$apply(function() {
        $rootScope.$broadcast('leaves', data);
      });
    });

    socket.on('message', function(data) {
      $rootScope.$apply(function() {
        $rootScope.$broadcast('message', data);
      });
    });
  }
  return {
    connect: _connect,
    send_message: _send_message
  }
});