const Promise = require("bluebird");
const mongoose = require("mongoose");
const httpStatus = require("http-status");
const _ = require("lodash");
const APIError = require("../../helpers/APIError");

const trainSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  number: {
    type: String,
    required: true,
    unique: true,
  },
  fromStationCode: {
    type: String,
    required: true,
  },
  toStationCode: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  availableSheets: {
    type: Number,
    required: true,
  },
});

trainSchema.method({
  safeModel() {
    return _.omit(this.toObject(), ["createdAt", "__v", "availableSheets"]);
  },
});

trainSchema.statics = {
  get(id) {
    return this.findById(id)
      .exec()
      .then((train) => {
        if (train) {
          return train;
        }
        const err = new APIError(
          "No such train exists!",
          httpStatus.NOT_FOUND,
          true
        );
        return Promise.reject(err);
      });
  },
  list(fromStationCode,toStationCode) {
    let filter={}
    if(fromStationCode && toStationCode)
      filter = {fromStationCode,toStationCode}
    return this.find(filter).exec();
  },
};


module.exports = mongoose.model('Train', trainSchema);
