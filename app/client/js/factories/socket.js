app.factory('socketFactory', function($rootScope) {
  var _socket;
  var _connect = function(token) {
    _socket = io.connect('http://0.0.0.0:8080', {
      'query': 'token='+token
    })
    registerEvents(_socket);
  };
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
  }
  return {
    connect: _connect
  }
});