exports.validate = function(user) {
  var validateName = function(name) {
    if(!name || name.length === 0) {
      return {
        valid: false,
        errors: {
          name: "can't be blank."
        }
      };
    } else {
      return {
        valid: true,
        errors: {}
      };
    }
  };
  return validateName(user.name);
};