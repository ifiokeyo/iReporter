import session from 'express-session';
import pgSession from 'connect-pg-simple'


const sessionManagementConfig = (app) => {
  session.Session.prototype.login = function (user, cb) {
    const req = this.req;
    req.session.regenerate((err) => {
      if (err) {
        cb(err);
      }
    });
    req.session.userInfo = user;
    cb();
  }
  const conn = {
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.POSTGRES_DB,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
  }
  const pgSessionStore = pgSession(session);
  const pgStoreConfig = {
    conObject: conn,
    ttl: (1 * 60 * 60)
  }
  app.use(session({
    store : new pgSessionStore(pgStoreConfig),
    secret: process.env.SECRET,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
      path: '/',
      expires: true,
      httpOnly: true,
      secure: false, // true for production
      maxAge: 1 * 60 * 60 * 1000
    },
    name: 'id'
  }));

};

export default sessionManagementConfig;