import { Router } from 'express';
import { getAllIncidents, updateIncident } from '../controllers/admin';
import adminValidator from '../utility/isAdmin';
import config from '../auth/jwtConfig';
import auth from '../auth/auth';


const adminRouter = Router();

adminRouter.use(auth.authenticate('jwt', config.jwtSession));

adminRouter.get('/incident', adminValidator, getAllIncidents);
adminRouter.patch('/red-flag/:id', adminValidator, updateIncident);
adminRouter.patch('/intervention/:id', adminValidator, updateIncident);

export default adminRouter;