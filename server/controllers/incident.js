import models from '../models';
import { incidentValidator } from '../utility/inputValidator';
import debug from 'debug';
import Sequelize from 'sequelize';
import validator from 'validator';


const { Incident } = models;
const logger = debug('server:incident');
const { Op } = Sequelize;

export const create = async (req, res) => {
  const { errors, isValid } = incidentValidator(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const incidentType = req.originalUrl.split('/')[3].slice(0, -1);
  const { user: { id } } = req;
  const { location, images, videos, comment } = req.body;
  const coord_arr = location.split(',');
  const loc = {
    type: 'Point',
    coordinates: coord_arr
  };

  try {
    const redFlag = await Incident.create({
      location: loc,
      images,
      videos,
      comment,
      type: incidentType,
      createdBy: id
    });
    const incident = redFlag.toJSON();

    return res.status(201).send({
      data: {
        incident,
        message: 'Red-Flag incident reported successfully'
      }
    })
  }
  catch(err) {
    return res.status(500).send({
      error: 'Server error'
    })
  }
}

export const getAll = async (req, res) => {
  const incidentType =  req.originalUrl.split('/')[3].slice(0, -1);
  const { user: { id } } = req;

  try {
    const incidents = await Incident.findAll({
      where: {
        createdBy : {
          [Op.eq]: id
        },
        type : {
          [Op.eq]: incidentType
        }
      }
    });
    return res.status(200).send({
      data: {
        incidents
      }
    })
  }
  catch(err) {
    return res.status(500).send({
      error: {
        message: 'Server error',
        error
      }
    })
  }

}

export const getOne = (req, res) => {
  const { incident } = req;
  return res.status(200).send({
    data: {
      incident
    }
  })
}

export const update = async (req, res) => {
  const updateType = req.originalUrl.split('/')[5];
  const { incident } = req;

  try {
    if (incident.status != 'pending') {
      return res.status(403).send({
        error: 'Report cannot be edited'
      })
    }

    let updateData;

    if (updateType === 'location') {
      const { body: { location } } = req;
      const coord_arr = (validator.blacklist(location, '\/\&<%#@^*>$[\\]')).split(',');
      const loc = {
        type: 'Point',
        coordinates: coord_arr
      };
      updateData = {
        location: loc
      }
    }
    else {
      const { body: { comment } } = req;
      const sanitizedComment = validator.escape(comment);
      updateData = {
        comment: sanitizedComment
      }
    }

    const updatedReport =  await incident.update(updateData, { returning: true, plain: true });

    return res.status(200).send({
      data: {
        incident: updatedReport,
        message: 'Report updated successfully'
      }
    })
  }
  catch(err) {
    return res.status(500).send({
      error: {
        message: 'Server error',
        error
      }
    })
  }
}


