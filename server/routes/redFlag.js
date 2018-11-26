import { Router } from 'express';
import { create, getAll, getOne, update } from '../controllers/incident';
import auth from '../auth/auth';
import config from '../auth/jwtConfig';


const redFlagRouter = Router();

redFlagRouter.use(auth.authenticate('jwt', config.jwtSession));

redFlagRouter.post('/', create);
redFlagRouter.get('/', getAll);
redFlagRouter.get('/:id', getOne);
redFlagRouter.patch(['/:id/comment', '/:id/location'], update);

export default redFlagRouter;
