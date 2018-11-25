import models from '../models';
import dataValidator from '../utility/incidentValidator';
import debug from 'debug';
import Sequelize from 'sequelize';
import validator from 'validator';


const { Incident } = models;
const logger = debug('server:incident');
const { Op } = Sequelize;

export const create = async (req, res) => {
  const { errors, isValid } = dataValidator(req.body);

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
      error: 'Server error'
    })
  }

}

export const getOne = async (req, res) => {
  const incidentType =  req.originalUrl.split('/')[3].slice(0, -1);
  const { user: { id } } = req;
  const incidentId = req.params.id;


  try {
    const incident = await Incident.findOne({
      where: {
        createdBy : {
          [Op.eq]: id
        },
        type : {
          [Op.eq]: incidentType
        },
        id : {
          [Op.eq]: incidentId
        }
      }
    });

    if (!incident) {
      return res.status(404).send({
        error: 'Report not found!'
      })
    }

    return res.status(200).send({
      data: {
        incident
      }
    })
  }
  catch(err) {
    return res.status(500).send({
      error: 'Server error'
    })
  }
}

export const updateLocation = async (req, res) => {
  const incidentType =  req.originalUrl.split('/')[3].slice(0, -1);
  const updateType = req.originalUrl.split('/')[5];
  const { user: { id } } = req;
  const incidentId = req.params.id;


  try {
    const incident = await Incident.findOne({
      where: {
        createdBy : {
          [Op.eq]: id
        },
        type : {
          [Op.eq]: incidentType
        },
        id : {
          [Op.eq]: incidentId
        }
      }
    });

    if (!incident) {
      return res.status(404).send({
        error: 'Report not found!'
      })
    }

    if (updateType === 'location') {
      const { body: { location } } = req;
      const coord_arr = (validator.blacklist(location, '\/\&<%#@^*>$[\\]')).split(',');
      const loc = {
        type: 'Point',
        coordinates: coord_arr
      };
      const updateData = {
        location: loc
      }
    }
    else {
      const { body: { comment } } = req;
      const sanitizedComment = (validator.blacklist(location, '\/\&<%#@^*>$[\\]')).split(',');
      const updateData = {
        comment
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
      error: 'Server error'
    })
  }
}


