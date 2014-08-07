describe('userTopicsFactory', function() {
  var factory;

  beforeEach(function() {
    module('peopleOnTopicsApp');
    inject(function(userTopicsFactory) {
      factory = userTopicsFactory;
    });
  });

  describe('.add_topic', function() {
    describe('when I add new topic', function() {
      it('should include new topic in topics', function() {
        factory.add_topic('travel');
        expect(factory.topics).toEqual({'travel':1});
      });
    });
    describe('when the topic was already added', function() {
      it('should not add new topic', function() {
        factory.add_topic('travel');
        factory.add_topic('travel');
        expect(factory.topics).toEqual({'travel':1});
      });
    });
    describe('when topic name is in mixed case', function() {
      it('should add downcased topic name', function() {
        factory.add_topic('TraVel');
        expect(factory.topics).toEqual({'travel': 1})
      });
    });
    describe('when topic name is longer than 12 chars', function() {
      it('should cut topic name and add trailing dots', function() {
        factory.add_topic("aaaaaaaaaaaaaaaaa");
        var expected_name = "aaaaaaaaaaaa...";
        var expected_topics = {};
        expected_topics[expected_name] = 1;
        expect(factory.topics).toEqual(expected_topics);
      });
    });
    describe('when topic begins with whitespaces', function() {
      it('should remove cut those whitespaces', function() {
        factory.add_topic("   a aaaaaaaaaaaaaaaa");
        var expected_name = "a aaaaaaaaaa...";
        var expected_topics = {};
        expected_topics[expected_name] = 1;
        expect(factory.topics).toEqual(expected_topics);
      });
    });
  });

});