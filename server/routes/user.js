import { Router } from 'express';
import { create } from '../controllers/user';


const userRouter = Router();

userRouter.post('/signup', create);

export default userRouter;