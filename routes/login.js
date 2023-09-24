const express = require("express");
const account = require("../controllers/account.ctl");
const rateLimiter = require("../middileware/rate-limit");
const router = express.Router();

router.post('/tenant', rateLimiter.loginRouteRateLimiter, (req, res, next) => { req.body.role = "TENANT"; next() }, account.login);
router.post('/landlord', rateLimiter.loginRouteRateLimiter, (req, res, next) => { req.body.role = "LANDLORD"; next() }, account.login);
router.post('/admin', rateLimiter.loginRouteRateLimiter, (req, res, next) => { req.body.role = "ADMIN"; next() }, account.login);

module.exports = router;