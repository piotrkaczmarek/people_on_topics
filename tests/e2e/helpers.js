var addTopic = function(browser, topic) {
  browser.element(by.model('new_topic')).sendKeys(topic);
  browser.element(by.id('add_topic_button')).click();

};
exports.addTopic = addTopic;

exports.log_in = function(browser, name, topics) {
  browser.get('http://localhost:8000');
  browser.element(by.model('currentUser.name')).sendKeys(name);
  browser.element(by.model('currentUser.age')).sendKeys('20');

  topics.forEach(function(topic) {
    addTopic(browser,topic);
  });
  browser.element(by.id('start_button')).click();
};