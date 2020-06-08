const Booking = require("./booking.model");
const Train = require("../train/train.model");

function load(req, res, next, bookingId) {
  Booking.get(bookingId)
    .then((ticket) => {
      req.ticket = ticket;
      return next();
    })
    .catch((e) => next(e));
}

/**
 * booking Tickets
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function book(req, res, next) {
  const userId = res.locals.session._id;
  const body = { ...req.body, userId };
  const booking = new Booking(body);
  booking
    .save()
    .then((savedTicket) => res.json(savedTicket.safeModel()))
    .catch((e) => next(e));
}

/**
 * checking availablity of tickets
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
async function checkAvailablity(req, res, next) {
  const { journyDate, trainId } = req.body;
  try {
    const train = await Train.get(trainId);
    const tickets = await Booking.getBydateAndTrain(journyDate, trainId);
    const bookedTicketCounts = tickets.reduce(
      (a, t) => a + t.numberOfTickets,
      0
    );
    return res.json({ count: train.availableSheets - bookedTicketCounts });
  } catch (error) {
    next(error);
  }
}

async function getTickets(req, res, next) {
  const userId = res.locals.session._id;
  Booking.getByUser(userId)
    .then((tickets) => res.json(tickets))
    .catch((e) => next(e));
}
async function cancelTicket(req, res, next) {
  const { ticket } = req;
  ticket.isActive = false;
  ticket
    .save()
    .then((savedticket) => res.json(savedticket.safeModel()))
    .catch((e) => next(e));
}

module.exports = {
  book,
  checkAvailablity,
  getTickets,
  load,
  cancelTicket,
};
