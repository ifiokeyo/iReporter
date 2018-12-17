import { signupValidator } from './inputValidator';
import models from '../models';
import Sequelize from 'sequelize';


const { User } = models;
const { Op } = Sequelize;

export const userExistChecker = async (req, res, next) => {
  const { errors, isValid } = signupValidator(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { body: { email } } = req;

  try {
    const user = await User.findOne({
      where: {
        email: {
          [Op.eq]: email
        }
      }
    });
    if (user) {
      return res.status(400).send({
        error: 'An account with that email address already exists'
      });
    }
    return next();
  }
  catch (error) {
    return res.status(500).send({
      error: {
        message: 'Server error',
        error
      }
    })
  }
}