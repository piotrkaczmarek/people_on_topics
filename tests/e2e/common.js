exports.log_in = function(browser, name, topics) {
  browser.get('http://localhost:8000');
  browser.element(by.model('current_user.name')).sendKeys(name);
  browser.element(by.model('current_user.age')).sendKeys('20');

  topics.forEach(function(element) {
    browser.element(by.model('new_topic')).sendKeys(element);
    browser.element(by.id('add_topic_button')).click();
  });

  browser.element(by.id('start_button')).click();
};