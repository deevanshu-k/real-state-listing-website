const express = require("express");
const payment = require("../controllers/payment.ctl");
const router = express.Router();

router.post("/order",payment.createOrder);

module.exports = router;