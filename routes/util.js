const express = require("express");
const utilControllers = require("../controllers/util.ctl");
const router = express.Router();

router.get("/getAllStates", utilControllers.getAllStates);
router.get("/getAllCity/:code", utilControllers.getAllCities);

module.exports = router;