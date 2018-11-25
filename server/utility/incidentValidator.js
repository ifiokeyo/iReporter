import validator from 'validator';
import isEmpty from 'lodash/isEmpty';

const incidentValidator = (reqData) => {
  const errors = {};

  if (!validator.isLatLong(reqData.location)) {
    errors.location = 'Location is invalid';
  }
  
  return {
    errors,
    isValid: isEmpty(errors)
  };

}

export default incidentValidator;
