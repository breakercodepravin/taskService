const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateContactInput(data) {
  let errors = {};
  data.name = !isEmpty(data.name) ? data.name : '';
  data.number = !isEmpty(data.number) ? data.number : '';

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name field is required';
  }
  if (Validator.isEmpty(data.number)) {
      errors.number = 'Number field is required'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};