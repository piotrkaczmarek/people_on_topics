describe('twoUserConversation', function () {
  var log_in = require('./common').log_in;
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
  describe('when both users log in', function() {
    beforeEach(function() {
      log_in(browserOne, 'Bob', ['sports']);
      log_in(browserTwo, 'Susan', ['sports']);
    });
    describe('when Bob talks to Susan', function() {
      beforeEach(function() {
        browserOne.element(by.id('Susan_open_message_box_btn')).click();
        browserOne.element(by.id('Susan_msg')).sendKeys('Hi Susan');
        browserOne.element(by.css('.send_button')).click();
      });
      it("both Susan and Bos should see Bob's message", function() {
        expect(browserOne.element(by.id('message_0')).getText()).toEqual('Bob: Hi Susan');
        expect(browserTwo.element(by.id('message_0')).getText()).toEqual('Bob: Hi Susan');
      });
      describe('when Susan replies', function() {
        beforeEach(function() {
          browserTwo.element(by.id('Bob_msg')).sendKeys('Hello there Bob!');
          browserTwo.element(by.css('.send_button')).click();
        });
        it("they both should see Susan's message", function() {
          expect(browserOne.element(by.id('message_1')).getText()).toEqual('Susan: Hello there Bob!');
          expect(browserTwo.element(by.id('message_1')).getText()).toEqual('Susan: Hello there Bob!');
        });
      });
    });
  });
});