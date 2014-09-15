describe('filteringUsersByTopics', function() {
  var log_in = require('./helpers').log_in;
  var browserOne = protractors[0].browser;
  var browserTwo = protractors[1].browser;
  var redis = require('redis').createClient();
  var elasticsearch = require('elasticsearch');
  var esClient = new elasticsearch.Client({
    host: 'localhost:9200'
  });
  beforeEach(function() {
    esClient.deleteByQuery({index: 'users', body: {query: {match_all: {}}}});
    redis.flushall();
  });
  describe('when users have common topic', function() {
    beforeEach(function() {
      log_in(browserOne, 'Bob', ['sports', 'politics']);
      log_in(browserTwo, 'Susan', ['sports', 'travels']);
    });
    it('they should see each other', function() {
      expect(browserOne.element(by.id('Susan_open_message_box_btn')).isPresent()).toBe(true);
      expect(browserTwo.element(by.id('Bob_open_message_box_btn')).isPresent()).toBe(true);
    });
  });  
  describe('when users do not have common topic', function() {
    beforeEach(function() {
      log_in(browserOne, 'Bob', ['cooking', 'politics']);
      log_in(browserTwo, 'Susan', ['sports', 'travels']);
    });
    it('they should not see each other', function() {
      expect(browserOne.element(by.id('Susan_open_message_box_btn')).isPresent()).toBe(false);
      expect(browserTwo.element(by.id('Bob_open_message_box_btn')).isPresent()).toBe(false);
    });
  });
});