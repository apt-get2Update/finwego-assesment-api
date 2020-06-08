const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const _ = require('lodash');
const APIError = require('../../helpers/APIError');

const placeSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  placeSchema.method({
  
    safeModel() {
      return _.omit(this.toObject(), ['createdAt', '__v', ]);
    },
  });
  
  placeSchema.statics = {
    get(id) {
      return this.findById(id)
        .exec()
        .then((place) => {
          if (place) {
            return place;
          }
          const err = new APIError('No such Place exists!', httpStatus.NOT_FOUND, true);
          return Promise.reject(err);
        });
    },
    list() {
      return this.find()
        .exec();
    }
  }
  
  module.exports = mongoose.model('Place', placeSchema);