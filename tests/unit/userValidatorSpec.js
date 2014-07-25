describe('UserValidator', function() {
  var UserValidator = require('../../app/server/lib/userValidator');

  describe('.validate', function() {
    describe('not valid', function() {
      describe('when name is blank', function() {
        var user = {
          name: '',
          sex: 'male',
          age: 15
        }

        it("it should return that it's not valid", function() {
          expect(UserValidator.validate(user).valid).toBe(false);
        });
        it('it should return error message', function() {
          expect(UserValidator.validate(user).errors.name).toBeDefined();
        });
      });
      describe('when there is no name attribute', function() {
        var user = {
          sex: 'male',
          age: 15
        }
        it("it should return that it's not valid", function() {
          expect(UserValidator.validate(user).valid).toBe(false);
        });
        it('it should return error message', function() {
          expect(UserValidator.validate(user).errors.name).toBeDefined();
        });
      });
    });
    describe('when valid', function() {
      var user = {
        name: 'Bob',
        sex: 'male',
        age: 15
      }
      it('should return that it is valid', function(){
        expect(UserValidator.validate(user)).toEqual({valid: true, errors: {}})
      })

    })
  });


});