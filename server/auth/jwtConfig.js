require('dotenv').config()

export default ({
  jwtSecret: process.env.JWT_SECRET,
  scheme: process.env.JWT_SCHEME,
  jwtSession: {
    session: false
  }
});