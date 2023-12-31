const express = require("express");
const router = express.Router();
const payment = require("../controllers/payment.ctl");
const auth = require("../middileware/auth");
const rateLimiter = require("../middileware/rate-limit");

router.post("/order", rateLimiter.paymentRouteRateLimiter, auth.checkAuthentication, payment.createOrder);
router.post('/paymentCapture', payment.orderPaidWebhook);

module.exports = router;