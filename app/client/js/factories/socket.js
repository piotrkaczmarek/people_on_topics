app.factory('socket', function() {
  var _socket;
  var _connect = function(token) {
    _socket = io.connect('http://0.0.0.0:8080', {
      'query': 'token='+token
    }).on('connect', function() {
      console.log('Socket authenticated');
      return;
    }).on('joins', function(user) {
      console.log(user,' joined!');
    }).on('leaves', function(user) {
      console.log(user,' left!');
    });
  };
  return {
    connect: _connect
  }
});