import validator from 'validator';
import { isEmpty } from 'lodash';

export const signupValidator = (reqData) => {
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

export const loginValidator = (reqData) => {
  const errors = {};

  if (!validator.isEmail(reqData.email)) {
    errors.email = 'Email is invalid';
  }

  if (!validator.isLength(reqData.password, 8, undefined)) {
    errors.password = 'Password must be at least 8 characters';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}

export const incidentValidator = (reqData) => {
  const errors = {};

  if (!validator.isLatLong(reqData.location)) {
    errors.location = 'Location is invalid';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}

export const updateValidator = (reqData) => {
  const errors = {};

  if (!validator.isIn(reqData.status, ['under investigation', 'rejected', 'resolved'])) {
    errors.location = "Status can only be updated to either 'under investigation', 'rejected',  or 'resolved'";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}
