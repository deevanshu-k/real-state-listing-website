const express = require("express");
const router = express.Router();
const tenant = require('../controllers/tenant.ctl');
const landlord = require('../controllers/landlord.ctl');
const otp = require('../controllers/otp.ctl');

router.post('/tenant',tenant.register);
router.post('/landlord',landlord.register);
router.post('/verify',otp.verifyEmail);

module.exports = router;