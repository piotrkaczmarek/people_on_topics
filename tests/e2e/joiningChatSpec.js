describe('joining chat', function () {
  describe('when on main page', function() {
    beforeEach(function() {
      browser.get('http://localhost:8080');
    });
    it('should have title', function() {
      expect(browser.getTitle()).toEqual('People on Topics');
    });
    describe('and when filling user data', function() {
      beforeEach(function() {
        element(by.id('dropdownMenu1')).click();
        element(by.model('user.name')).sendKeys('bob');
        element(by.model('user.age')).sendKeys('20');
        element(by.id('start_button')).click();
      });
      it('should add new user', function(){
        expect(element.all(by.css('.user_button')).count()).toEqual(1);
      });
      
    });
  });
});