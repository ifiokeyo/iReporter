import { Router } from 'express';
import { create, login } from '../controllers/user';


const userRouter = Router();

userRouter.post('/signup', create);
userRouter.post('/login', login);

export default userRouter;