const express = require("express");
const account = require("../controllers/account.ctl");
const rateLimiter = require("../middileware/rate-limit");
const auth = require("../middileware/auth");
const router = express.Router();

router.post('/requestpasswordreset', rateLimiter.loginRouteRateLimiter, auth.checkAuthentication, account.requestPasswordReset);
router.post('/resetpassword', account.resetPassword);

module.exports = router;