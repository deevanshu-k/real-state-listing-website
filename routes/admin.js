const express = require("express");
const router = express.Router();
const rateLimiter = require("../middileware/rate-limit");
const userControllers = require("../controllers/user.ctl");
const propertyControllers = require("../controllers/property.ctl");
const checkUser = require("../middileware/user");
const auth = require("../middileware/auth");

// For User
/* Get All Landlords */
router.get("/landlords", rateLimiter.commonOperationsRouteRateLimiter, auth.checkAuthentication, checkUser.admin, userControllers.getAllLandlords);
/* Get All Tenants */
router.get("/tenants", rateLimiter.commonOperationsRouteRateLimiter, auth.checkAuthentication, checkUser.admin, userControllers.getAllTenants);
/* Get Landlord Documents */
router.get("/landlord/:Id/documents", rateLimiter.commonOperationsRouteRateLimiter, auth.checkAuthentication, checkUser.admin, userControllers.getLandlordDocuments);
/* Get Tenant Documents */
router.get("/tenant/:Id/documents", rateLimiter.commonOperationsRouteRateLimiter, auth.checkAuthentication, checkUser.admin, userControllers.getTenantDocuments);

// For Property
/* Get All Property + Get Landlord All Property */
router.get("/property", rateLimiter.commonOperationsRouteRateLimiter, auth.checkAuthentication, checkUser.admin,  propertyControllers.adminGetAllProperty);

module.exports = router;