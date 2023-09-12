const express = require("express");
const router = express.Router();
const sample = require("../controllers/sample.ctl");

router.get("/sample",sample.sample)

module.exports = router;