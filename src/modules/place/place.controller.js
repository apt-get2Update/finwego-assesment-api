const Place = require("./place.model");
const httpStatus = require("http-status");
const APIError = require("../../helpers/APIError");

function load(req, res, next, placeId) {
  Place.get(placeId)
    .then((place) => {
      req.place = place;
      return next();
    })
    .catch((e) => next(e));
}

function get(req, res) {
  return res.json(req.place.safeModel());
}

function getPlace(req, res, next) {
  Place.get(req.params.placeId)
    .then((place) => res.json(place.safeModel()))
    .catch((e) => next(e));
}
function create(req, res, next) {
  const place = new Place(req.body);

  Place.findOne({ code: place.code })
    .exec()
    .then((foundPlace) => {
      if (foundPlace) {
        return Promise.reject(
          new APIError("Place Code must be unique", httpStatus.CONFLICT, true)
        );
      }
      return place.save();
    })
    .then((savedPlace) => res.json(savedPlace))
    .catch((e) => next(e));
}

function update(req, res, next) {
  const { place } = req;
  place.name = req.body.name || place.name;
  place.code = req.body.code || place.code;

  place
    .save()
    .then((savedplace) => res.json(savedplace.safeModel()))
    .catch((e) => next(e));
}

function list(req, res, next) {
  Place.list()
    .then((places) => res.json(places))
    .catch((e) => next(e));
}

function remove(req, res, next) {
  const { place } = req;
  place
    .remove()
    .then((deletePlace) => res.json(deletePlace.safeModel()))
    .catch((e) => next(e));
}

module.exports = {
  load,
  get,
  create,
  getPlace,
  update,
  list,
  remove,
};
