const express = require('express');
const expressJwt = require('express-jwt/lib');
const config = require('./config');
const userRoutes = require('./modules/user/user.routes');
const authRoutes = require('./modules/auth/auth.routes');
const placeRoutes = require("./modules/place/place.routes");
const trainRoutes = require("./modules/train/train.routes");
const bookingRoutes = require("./modules/booking/booking.routes")

const router = express.Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => res.send('OK'));

// mount auth routes at /auth
router.use('/auth', authRoutes);
router.use('/place', placeRoutes);
router.use('/train', trainRoutes);

// Validating all the APIs with jwt token.
router.use(expressJwt({ secret: config.jwtSecret }));

// If jwt is valid, storing user data in local session.
router.use((req, res, next) => {
  const authorization = req.header('authorization');
  res.locals.session = JSON.parse(Buffer.from((authorization.split(' ')[1]).split('.')[1], 'base64').toString()); // eslint-disable-line no-param-reassign
  next();
});

// mount user routes at /users
router.use('/users', userRoutes);
router.use('/booking',bookingRoutes)


module.exports = router;
