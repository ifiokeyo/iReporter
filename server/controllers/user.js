import models from '../models';
import validator from '../utility/signupValidator';
import { omit } from 'lodash';
import jwt from 'jsonwebtoken';
import Sequelize from 'sequelize';
import debug from 'debug';
import jwtConfig from '../auth/jwtConfig';

const logger = debug('server:userController');
const { Op } = Sequelize;
const secretKey = jwtConfig.jwtSecret;

const { User } = models;


export const create = async (req, res) => {
  const { errors, isValid } = validator(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { firstName, lastName, email, phoneNumber, password } = req.body;
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

    let newUser = await User.create(
      {
        email,
        firstName,
        lastName,
        password,
        phoneNumber
      }
    );
    newUser = newUser.toJSON();
    const payload = {
      role: newUser.role,
      email: newUser.email
    };
    const userInfo = omit(newUser, ['password']);
    const token = jwt.sign(payload, secretKey, {
      expiresIn: '24h'
    });

    return res.status(201).send(
      {
        data: {
          user: userInfo,
          token,
          message: 'User signup completed successfully'
        }
      }
    );
  }
  catch(err) {
    return res.status(500).send({
      error: 'Server error'
    })
  }
};

