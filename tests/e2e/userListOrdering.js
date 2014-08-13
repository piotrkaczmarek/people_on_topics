describe('userListOrdering', function() {
  var log_in = require('./common').log_in;
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

  describe('when all users are logged in', function() {
    beforeEach(function() {
      log_in(browserOne, 'Bob', ['travels']);
      log_in(browserTwo, 'Claudia', ['sports', 'travels', 'books']);
      log_in(browserThree, 'Zack', ['sports', 'books','travels']);
    });
    it('they should see each other ordered by common interests', function() {
      browserThree.element.all(by.css('.user_button')).then(function(elements) {
        if(elements.length === 3) {
          expected_order = ['', 'Claudia', 'Bob'];
        } else {
          expected_order = ['Claudia', 'Bob'];
        }
        for(var i = 0 ; i < elements.length; i++) {
          expect(elements[i].getText()).toContain(expected_order[i]);
        }
      });
    });
  });
});