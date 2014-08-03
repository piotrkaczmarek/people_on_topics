describe('currentUser', function() {
  describe('.setUser and .getUser', function() {
    var service;
    beforeEach(function() {
      module('peopleOnTopicsApp');
      inject(function(currentUser) {
        service = currentUser;
      });
    });
    describe('when user is set ', function() {
      var user = { name: 'bob',
                   sex: 'male',
                   age: 20}
      beforeEach(function() {
        service.setUser(user);
      });
      it('getter should return the same user', function() {
        expect(service.getUser()).toEqual(user);
      });
    })
  });
})