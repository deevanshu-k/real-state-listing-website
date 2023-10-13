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
// Return all properties of landlord
router.post("", rateLimiter.landlordOperationsRouteRateLimiter, auth.checkAuthentication, checkUser.landlord, property.createProperty);
// Body Passed { property_name }
router.put("", rateLimiter.landlordOperationsRouteRateLimiter, auth.checkAuthentication, checkUser.landlord, property.updateProperty);
// Body Passed { id , property_name }
router.delete("", rateLimiter.landlordOperationsRouteRateLimiter, auth.checkAuthentication, checkUser.landlord, property.deleteProperty);
// Body Passed { id }
// Delete Only If No Rooms Are present

module.exports = router;