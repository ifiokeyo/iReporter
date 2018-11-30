import { Router } from 'express';
import { create, getAll, getOne, update } from '../controllers/incident';
import auth from '../auth/auth';
import config from '../auth/jwtConfig';
import { Incident } from '../models';
import Sequelize from 'sequelize';


const interventionRouter = Router();
const { Op } = Sequelize;

redFlagRouter.use(auth.authenticate('jwt', config.jwtSession));

interventionRouter.param('id', async (req, res, next, id) => {
  const incidentType =  req.originalUrl.split('/')[3].slice(0, -1);
  const userId  = req.user.id;

  try {
    const incident = await Incident.findOne({
      where: {
        createdBy : {
          [Op.eq]: userId
        },
        type : {
          [Op.eq]: incidentType
        },
        id : {
          [Op.eq]: id
        }
      }
    });
    if (!incident) {
      return res.status(404).send({
        error: 'Report not found!'
      })
    }
    req.incident = incident;
    next();
  }
  catch(error) {
    return res.status(500).send({
      error: {
        message: 'Server error',
        error
      }
    })
  }
})

interventionRouter.post('/', create);
interventionRouter.get('/', getAll);
interventionRouter.get('/:id', getOne);
interventionRouter.patch(['/:id/comment', '/:id/location'], update);

export default interventionRouter;
