const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/user.ctl");
const rateLimiter = require("../middileware/rate-limit");
const auth = require("../middileware/auth");

router.get("/documents", rateLimiter.commonOperationsRouteRateLimiter, auth.checkAuthentication, userControllers.getUserDocuments);
router.get("/details", rateLimiter.commonOperationsRouteRateLimiter, auth.checkAuthentication, userControllers.getUserDetails);

module.exports = router;