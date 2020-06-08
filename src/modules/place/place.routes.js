const express = require('express');
const validate = require('express-validation');
const Joi = require('@hapi/joi');
const placeCtrl = require('./place.controller');

const router = express.Router(); 
const paramValidation = {
  createPlace: {
    body: {
      name: Joi.string().required(),
      code: Joi.string().required(),
    },
  },
  updatePlace: {
    params: {
        placeId: Joi.string().required(),
    },
    body: {
      name: Joi.string().required(),
      code: Joi.string().required(),
    },
  },
};

router.route('/')
  .get(placeCtrl.list)
  .post(validate(paramValidation.createPlace), placeCtrl.create);

router.route('/:placeId')
  .get(placeCtrl.getPlace)
  .put(validate(paramValidation.updatePlace), placeCtrl.update)
  .delete(placeCtrl.remove);

router.param('placeId', placeCtrl.load);

module.exports = router;