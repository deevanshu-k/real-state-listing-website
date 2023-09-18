const express = require("express");
const router = express.Router();
const tenant = require('../controllers/tenant.ctl');
const landlord = require('../controllers/landlord.ctl');

router.post('/tenant',tenant.register);
router.post('/landlord',landlord.register);

module.exports = router;