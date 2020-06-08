const Train = require("./train.model");
const httpStatus = require("http-status");
const APIError = require("../../helpers/APIError");

function load(req, res, next, trainId) {
  Train.get(trainId)
    .then((train) => {
      req.train = train;
      return next();
    })
    .catch((e) => next(e));
}

function get(req, res) {
  return res.json(req.Train.safeModel());
}

function getTrain(req, res, next) {
  Train.get(req.params.trainId)
    .then((train) => res.json(train.safeModel()))
    .catch((e) => next(e));
}
function create(req, res, next) {
  const train = new Train(req.body);

  Train.findOne({ code: train.number })
    .exec()
    .then((foundTrain) => {
      if (foundTrain) {
        return Promise.reject(
          new APIError("Train Number must be unique", httpStatus.CONFLICT, true)
        );
      }
      return train.save();
    })
    .then((savedTrain) => res.json(savedTrain))
    .catch((e) => next(e));
}

function update(req, res, next) {
  const { train } = req;
  train.name = req.body.name || train.name;
  train.number = req.body.number || train.number;
  train.availableSheets = req.body.availableSheets || train.availableSheets;
  train.fromStationCode = req.body.fromStationCode || train.fromStationCode;
  train.toStationCode = req.body.toStationCode || train.toStationCode;
  train.startTime = req.body.startTime || train.startTime;
  train.endTime = req.body.endTime || train.endTime;

  train
    .save()
    .then((savedTrain) => res.json(savedTrain.safeModel()))
    .catch((e) => next(e));
}

function list(req, res, next) {
  const { fromStationCode = "", toStationCode = "" } = req.query;
  Train.list(fromStationCode, toStationCode)
    .then((trains) => res.json(trains))
    .catch((e) => next(e));
}

function remove(req, res, next) {
  const { train } = req;
  train
    .remove()
    .then((deleteTrain) => res.json(deleteTrain.safeModel()))
    .catch((e) => next(e));
}

module.exports = {
  load,
  get,
  create,
  getTrain,
  update,
  list,
  remove,
  Train
};
