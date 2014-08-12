app.factory('userTopicsFactory', function() {
  var _topics = [];
  var _add_topic = function(name) {
    var sanitize = function(string) {
      string = string.trim();
      var topic_name = string.substr(0,12).toLowerCase();
      if(string.length > 12) {
        topic_name += '...';
      }
      return topic_name;
    };
    var check_if_unique = function(topic) {
      for(var i = 0; i < _topics.length; i++) {
        if(_topics[i] === topic) {
          return false;
        }
      }
      return true;
    };
    var topic = sanitize(name);
    if(check_if_unique(topic)) {
      _topics.push(topic);
    }
  };
  return {
    topics: _topics,
    add_topic: _add_topic
  };
});