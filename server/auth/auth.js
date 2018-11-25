import passport from 'passport';
import Sequelize from 'sequelize';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import config from './jwtConfig';
import models from '../models';
import { omit } from 'lodash';

const options = {
  secretOrKey: config.jwtSecret,
  authScheme: config.scheme,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const { User } = models;
const { Op } = Sequelize;

const emailValidator = new JwtStrategy(options, (payload, done) => {
  (async () => {
    try {
      const user = await User.findOne({ where: { email: { [Op.eq]: payload.email } } });
      if (!user) {
        return done(new Error('User not found'), false)
      }
      const authUser = omit(user.toJSON(), ['password', 'createdAt', 'updatedAt', 'phoneNumber']);
      return done(null, authUser);
    }
    catch (err) {
      done(err, null);
    }
  })();
});


passport.use(emailValidator);

export default passport;
