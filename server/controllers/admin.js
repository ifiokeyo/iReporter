import Sequelize from 'sequelize';
import models from '../models';
import { updateValidator } from '../utility/inputValidator';

const { Incident } = models;
const { Op } = Sequelize;


export const getAllIncidents = async (req, res) => {
  try {
    const incidents = await Incident.findAll();
    return res.status(200).send({
      data : {
        incidents
      }
    });
  }
  catch(error) {
    return res.status(500).send({
      error: {
        message: 'Server error',
        error
      }
    })
  }
}

export const updateIncident = async (req, res) => {
  const type = req.originalUrl.split('/')[4];
  const { params: { id }, body } = req;
  const { errors, isValid } = updateValidator(body);


  if (!isValid) {
    return res.status(400).json(errors);
  }

  try {
    const incident = await Incident.findOne({
      where: {
        id:{
          [Op.eq]: id
        },
        type: {
          [Op.eq] : type
        }
      }
    });
    const updatedIncident = await incident.update(body, { returning: true, plain: true });

    return res.status(200).send({
      data: {
        message: `Incident of type ${type} updated successfully`,
        incident: updatedIncident
      }
    })
  }
  catch(error) {
    return res.status(500).send({
      error: {
        message: 'Server error',
        error
      }
    })
  }
}