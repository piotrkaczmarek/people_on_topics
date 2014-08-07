app.factory('userTopicsFactory', function() {
  var _topics = {};
  var _add_topic = function(name) {
    name = name.trim();
    var topic_name = name.substr(0,12).toLowerCase();
    if(name.length > 12) {
      topic_name += '...';
    }
    _topics[topic_name] = 1;
  };
  return {
    topics: _topics,
    add_topic: _add_topic
  };
});