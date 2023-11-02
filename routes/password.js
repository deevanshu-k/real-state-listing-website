const express = require("express");
const account = require("../controllers/account.ctl");
const rateLimiter = require("../middileware/rate-limit");
const auth = require("../middileware/auth");
const router = express.Router();

router.post('/requestpasswordreset', rateLimiter.commonOperationsRouteRateLimiter, auth.checkAuthentication, account.requestPasswordReset);
router.post('/resetpassword', rateLimiter.commonOperationsRouteRateLimiter, account.resetPassword);

module.exports = router;