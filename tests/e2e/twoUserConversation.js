describe('twoUserConversation', function () {
  var browserOne = protractors[0].browser;
  var browserTwo = protractors[1].browser;
  var redis = require('redis').createClient();
  var elasticsearch = require('elasticsearch');
  var esClient = new elasticsearch.Client({
    host: 'localhost:9200'
  });

  var log_in = function(browser, name) {
    browser.get('http://localhost:8000');
    browser.element(by.model('current_user.name')).sendKeys(name);
    browser.element(by.model('current_user.age')).sendKeys('20');
    browser.element(by.id('start_button')).click();
  }
  beforeEach(function() {
    esClient.deleteByQuery({index: 'users', body: {query: {match_all: {}}}});
    redis.flushall();
  });
  describe('when both users log in', function() {
    var users = ['Bob', 'Susan'];
    beforeEach(function() {
      log_in(browserOne, users[0]);
      log_in(browserTwo, users[1]);
    });
    describe('when Bob leaves', function() {
      beforeEach(function() {
        redis.publish('leaves', 'Bob');
      });
      it('Susan should not see him', function() {
        expect(browserOne.element.all(by.css('.user_button')).count()).toEqual(1);
      });
    })
    describe('when Bob talks to Susan', function() {
      beforeEach(function() {
        browserOne.element(by.id('Susan_open_message_box')).click();
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