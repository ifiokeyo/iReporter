import validator from 'validator';
import isEmpty from 'lodash/isEmpty';

const signupValidator = (reqData) => {
  const errors = {};

  if (!validator.isEmail(reqData.email)) {
    errors.email = 'Email is invalid';
  }

  if (validator.isEmpty(reqData.firstName)) {
    errors.firstName = 'This field is required';
  }

  if (validator.isEmpty(reqData.lastName)) {
    errors.lastName = 'This field is required';
  }

  if (!validator.isLength(reqData.password, 8, undefined)) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (!validator.isMobilePhone(reqData.phoneNumber)) {
    errors.phoneNumber = 'Not a vaild phone number';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };

}

export default signupValidator;
