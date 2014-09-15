describe('userListOrdering', function() {
  var log_in = require('./helpers').log_in;
  var browserOne = protractors[0].browser;
  var browserTwo = protractors[1].browser;
  var browserThree = protractors[2].browser;
  var redis = require('redis').createClient();
  var elasticsearch = require('elasticsearch');
  var esClient = new elasticsearch.Client({
    host: 'localhost:9200'
  });

  beforeEach(function() {
    esClient.deleteByQuery({index: 'users', body: {query: {match_all: {}}}});
    redis.flushall();
  });
  var should_be_ordered = function(elements,order) {
    if(elements.length === 3) {
      var expected_order = [''].concat(order);
    } else {
      var expected_order = order;
    }
    for(var i = 0 ; i < elements.length; i++) {
      expect(elements[i].getText()).toContain(expected_order[i]);
    }
  };
  describe('when all users are logged in', function() {
    beforeEach(function() {
      log_in(browserOne, 'Bob', ['travels', 'aviation']);
      log_in(browserTwo, 'Claudia', ['sports', 'travels', 'books']);
      log_in(browserThree, 'Zack', ['sports', 'books','travels','aviation']);
    });
    it('they should see each other ordered by common interests', function() {
      browserThree.element.all(by.css('.user_button')).then(function(elements) {
        expect(elements.length).toBeGreaterThan(1);
        should_be_ordered(elements, ['Claudia', 'Bob']);
      });
      browserOne.element.all(by.css('.user_button')).then(function(elements) {
        expect(elements.length).toBeGreaterThan(1);
        should_be_ordered(elements, ['Zack', 'Claudia']);
      });
    });
  });
});