const express = require("express");
const router = express.Router();
const property = require("../controllers/property.ctl");
const auth = require("../middileware/auth");
const checkUser = require("../middileware/user");
const rateLimiter = require("../middileware/rate-limit");

/*
    Landlord Info is set at req.user By auth.checkAuthentication Middleware
*/
router.get("", rateLimiter.landlordOperationsRouteRateLimiter, auth.checkAuthentication, checkUser.landlord, property.getAllProperties);
router.put("", rateLimiter.landlordOperationsRouteRateLimiter, auth.checkAuthentication, checkUser.landlord, property.createProperty);
router.post("", rateLimiter.landlordOperationsRouteRateLimiter, auth.checkAuthentication, checkUser.landlord, property.updateProperty);
router.delete("", rateLimiter.landlordOperationsRouteRateLimiter, auth.checkAuthentication, checkUser.landlord, property.deleteProperty);

module.exports = router;