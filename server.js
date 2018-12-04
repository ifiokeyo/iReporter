import express from 'express';
import debug from 'debug';
import chalk from 'chalk';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import auth from './server/auth/auth';
import userRouter from './server/routes/user';
import redFlagRouter from './server/routes/redFlag';
import interventionRouter from './server/routes/intervention';
import adminRouter from './server/routes/admin';


const logger = debug('server');
const app = express();

app.use(morgan('tiny'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({
  secret: process.env.SECRET,
  key: process.env.KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: false,
  }, // in milliseconds
}));

app.use(auth.initialize());

const port = 5000;

app.use('/api/v1/auth', userRouter);
app.use('/api/v1/red-flags', redFlagRouter);
app.use('/api/v1/intervention', interventionRouter);
app.use('/api/v1/admin', adminRouter);
app.get('/', (req, res) => {
  return res.send('Welcome Docker');
})

app.listen(port, () => {
  logger(`Server running on port ${chalk.green(port)}`);
})