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
        expect(factory.topics).toEqual(['travel']);
      });
    });
    describe('when the topic was already added', function() {
      it('should not add new topic', function() {
        factory.add_topic('travel');
        factory.add_topic('travel');
        expect(factory.topics).toEqual(['travel']);
      });
    });
    describe('when topic name is in mixed case', function() {
      it('should add downcased topic name', function() {
        factory.add_topic('TraVel');
        expect(factory.topics).toEqual(['travel']);
      });
    });
    describe('when topic name is longer than 12 chars', function() {
      it('should cut topic name and add trailing dots', function() {
        factory.add_topic("aaaaaaaaaaaaaaaaa");
        expect(factory.topics).toEqual(["aaaaaaaaaaaa..."]);
      });
    });
    describe('when topic begins with whitespaces', function() {
      it('should remove cut those whitespaces', function() {
        factory.add_topic("   a aaaaaaaaaaaaaaaa");
        expect(factory.topics).toEqual(["a aaaaaaaaaa..."]);
      });
    });
  });
  describe('.matches', function() {
    describe('when all topics match', function() {
      beforeEach(function() {
        factory.add_topic('topic1');
        factory.add_topic('topic2');
      });
      it('should return true', function() {
        expect(factory.matches(['topic1', 'topic2'])).toEqual(true);
      });
    });
    describe('when not all topics match', function() {
      beforeEach(function() {
        factory.add_topic('topic1');
        factory.add_topic('topic2');
      });
      it('should return true', function() {
        expect(factory.matches(['topic5', 'topic2'])).toEqual(true);
      });
    });
    describe('when no topic matches', function() {
      beforeEach(function() {
        factory.add_topic('topic1');
        factory.add_topic('topic2');
      });
      it('should return false', function() {
        expect(factory.matches(['topic5', 'topic4'])).toEqual(false);
      });
    });
  });

});