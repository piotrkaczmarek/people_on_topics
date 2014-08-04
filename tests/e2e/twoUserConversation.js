describe('twoUserConversation', function () {
  var browserOne = protractors[0].browser;
  var browserTwo = protractors[1].browser;

  var log_in = function(browser, name) {
    browser.get('http://localhost:8080');
    browser.element(by.id('dropdownMenu1')).click();
    browser.element(by.model('user.name')).sendKeys(name);
    browser.element(by.model('user.age')).sendKeys('20');
    browser.element(by.id('start_button')).click();
  }
  var has_users = function(browser, names) {
    browser.element.all(by.css('.user_button')).then(function(elements) {
      for(var i = 0; i < names.length; i++) {
        expect(elements[i].getText()).toContain(names[i]);
      }
    });
  }
  describe('when both users log in', function() {
    var users = ['Bob', 'Susan'];
    beforeEach(function() {
      log_in(browserOne, users[0]);
      log_in(browserTwo, users[1]);
    });
    it('they should see each other', function() {
      has_users(browserOne, users);
      has_users(browserTwo, users);
    });
    describe('when Bob talks to Susan', function() {
      beforeEach(function() {
        browserOne.element.all(by.css('.user_button .btn')).last().click();
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