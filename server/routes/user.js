import { Router } from 'express';
import { create, login, logout } from '../controllers/user';
import { userExistChecker } from '../utility/userValidator';


const userRouter = Router();

userRouter.post('/signup', userExistChecker, create);
userRouter.post('/login', login);
userRouter.post('/logout', logout);

export default userRouter;