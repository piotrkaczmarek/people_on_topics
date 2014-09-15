app.factory('userTopicsFactory', function() {
  var _topics = [];
  var _addTopic = function(name) {
    var sanitize = function(string) {
      string = string.trim();
      var topic_name = string.substr(0,12).toLowerCase();
      if(string.length > 12) {
        topic_name += '...';
      }
      return topic_name;
    };
    var checkIfUnique = function(topic) {
      for(var i = 0; i < _topics.length; i++) {
        if(_topics[i] === topic) {
          return false;
        }
      }
      return true;
    };
    var topic = sanitize(name);
    if(checkIfUnique(topic)) {
      _topics.push(topic);
    }
  };
  var _matches = function(topics) {
    for(var i = 0; i < _topics.length; i++) {
      for(var j = 0; j < topics.length; j++) {
        if(_topics[i] === topics[j]) {
          return true;
        }
      }
    }
    return false;
  };
  return {
    topics: _topics,
    addTopic: _addTopic,
    matches: _matches
  };
});