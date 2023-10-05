const express = require("express");
const router = express.Router();
const payment = require("../controllers/payment.ctl");
const authMiddleware = require("../middileware/auth");

router.post("/order", authMiddleware.checkAuthentication, payment.createOrder);
router.post('/paymentCapture', payment.orderPaidWebhook);

module.exports = router;