const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/user.ctl");
const rateLimiter = require("../middileware/rate-limit");
const auth = require("../middileware/auth");
const checkUser = require("../middileware/user");

router.get("/documents", rateLimiter.commonOperationsRouteRateLimiter, auth.checkAuthentication, userControllers.getUserDocuments);

// For Admin
router.get("/landlords", rateLimiter.commonOperationsRouteRateLimiter, auth.checkAuthentication, checkUser.admin, userControllers.getAllLandlords ); 
router.get("/tenants", rateLimiter.commonOperationsRouteRateLimiter, auth.checkAuthentication, checkUser.admin, userControllers.getAllTenants ); 

module.exports = router;