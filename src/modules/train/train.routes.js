const express = require("express");
const validate = require("express-validation");
const Joi = require("@hapi/joi");
const trainCtrl = require("./train.controller");

const router = express.Router();
const paramValidation = {
  createTrain: {
    body: {
      number: Joi.string().required(),
      availableSheets: Joi.number().required(),
      fromStationCode: Joi.string().required(),
      toStationCode: Joi.string().required(),
      startTime: Joi.string().required(),
      endTime: Joi.string().required(),
    },
  },
  updateTrain: {
    params: {
      trainId: Joi.string().required(),
    },
    body: {
      name: Joi.string().required(),
      number: Joi.string().required(),
      availableSheets: Joi.number().required(),
      fromStationCode: Joi.string().required(),
      toStationCode: Joi.string().required(),
      startTime: Joi.string().required(),
      endTime: Joi.string().required(),
    },
  },
};

router
  .route("/")
  .get(trainCtrl.list)
  .post(validate(paramValidation.createTrain), trainCtrl.create);

router
  .route("/:trainId")
  .get(trainCtrl.getTrain)
  .put(validate(paramValidation.updateTrain), trainCtrl.update)
  .delete(trainCtrl.remove);

router.param("trainId", trainCtrl.load);

module.exports = router;
