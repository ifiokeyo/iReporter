import models from '../models';
import { loginValidator } from '../utility/inputValidator';
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
  const { firstName, lastName, email, phoneNumber, password } = req.body;
  try {
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

    req.session.login(userInfo, (err) => {
      if (err) {
        return res.status(500).send({
          error: {
            message: "There was an error logging in. Please try again later.",
            error: err
          }
        });
      }
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
  catch(error) {
    return res.status(500).send({
      error: {
        message: 'Server error',
        error
      }
    })
  }
};

export const login = async (req, res) => {
  const { errors, isValid } = loginValidator(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const {body: { email, password } } = req;
  try {
    const user = await User.findOne({
      where: {
        email: {
          [Op.eq]: email
        }
      }
    });
    if (!user) {
      return res.status(404).send({
        error: 'Account does not exist'
      });
    }

    if (User.isPassword(user.password, password)) {
      const payload = {
        id: user.id,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      };

      const token = jwt.sign(payload, secretKey, {
        expiresIn: '24h'
      });

      req.session.login(payload, (err) => {
        if (err) {
          return res.status(500).send({
            error: {
              message: "There was an error logging in. Please try again later.",
              error: err
            }
          });
        }
      });

      return res.status(201).send({
        data: {
          user: payload,
          message: 'User login completed successfully',
          token
        }
      });
    }
    return res.status(401).send({
      message: 'Please, enter the correct password or email'
    });
  }
  catch(error) {
    return res.status(500).send({
      error: {
        message: 'Server error',
        error
      }
    })
  }
};

export const logout = (req, res) => {
  req.session.destroy(function(err) {
    if (err) {
      return res.status(500).send({
        error: {
          message: 'server error',
          error: err
        }
      });
    };
  });
  return res.status(200).send({
    message: 'You successfully logged out'
  })
}

