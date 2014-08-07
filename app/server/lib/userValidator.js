exports.validate = function(user) {
  var validate_name = function(name) {
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
  return validate_name(user.name);
};