const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/user.ctl");
const auth = require("../middileware/auth");

router.get("/documents", auth.checkAuthentication, userControllers.getUserDocuments);

module.exports = router;