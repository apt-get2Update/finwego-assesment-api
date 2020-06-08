const Promise = require("bluebird");
const mongoose = require("mongoose");
const httpStatus = require("http-status");
const _ = require("lodash");
const APIError = require("../../helpers/APIError");

const trainSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  journyDate: {
    type: String,
    required: true,
  },
  trainId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Train",
  },
  numberOfTickets: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  bookedAt: {
    type: Date,
    default: Date.now,
  },
});

trainSchema.method({
  safeModel() {
    return _.omit(this.toObject(), ["__v"]);
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
          "No such ticket exists!",
          httpStatus.NOT_FOUND,
          true
        );
        return Promise.reject(err);
      });
  },
  getByUser(userId) {
    return this.find({ userId: userId }).exec();
  },
  getBydateAndTrain(date, trainId) {
    return this.find({ journyDate: date, trainId: trainId }).exec();
  },
};

module.exports = mongoose.model("Booking", trainSchema);
