const express = require("express");
const validate = require("express-validation");
const Joi = require("@hapi/joi");
const bookingCtrl = require("./booking.controller");

const router = express.Router();
const paramValidation = {
  book: {
    body: {
      trainId: Joi.string().required(),
      numberOfTickets: Joi.number().required(),
      journyDate: Joi.string().required(),
    },
  },
  availablity: {
    body: {
      trainId: Joi.string().required(),
      journyDate: Joi.string().required(),
    },
  },
};

router
  .route("/")
  .get(bookingCtrl.getTickets)
  .post(validate(paramValidation.book), bookingCtrl.book);
router.route("/:bookingId").put(bookingCtrl.cancelTicket);

router
  .route("/availablity")
  .post(validate(paramValidation.availablity), bookingCtrl.checkAvailablity);

router.param("bookingId", bookingCtrl.load);

module.exports = router;
