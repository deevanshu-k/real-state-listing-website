const express = require("express");
const router = express.Router();
const rateLimiter = require("../middileware/rate-limit");
const userControllers = require("../controllers/user.ctl");
const tenantControllers = require("../controllers/tenant.ctl");
const landlordControllers = require("../controllers/landlord.ctl");
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

/* Verify Landlord */
router.put("/landlords/:landlordId/verify", rateLimiter.commonOperationsRouteRateLimiter, auth.checkAuthentication, checkUser.admin, landlordControllers.adminverify);
/* Verify Tenant */
router.put("/tenants/:tenantId/verify", rateLimiter.commonOperationsRouteRateLimiter, auth.checkAuthentication, checkUser.admin, tenantControllers.adminverify);

/* Unverify Landlord */
router.put("/landlords/:landlordId/unverify", rateLimiter.commonOperationsRouteRateLimiter, auth.checkAuthentication, checkUser.admin, landlordControllers.adminunverify);
/* Unverify Tenant */
router.put("/tenants/:tenantId/unverify", rateLimiter.commonOperationsRouteRateLimiter, auth.checkAuthentication, checkUser.admin, tenantControllers.adminunverify);

// For Property
/* Get All Property + Get Landlord All Property */
router.get("/property", rateLimiter.commonOperationsRouteRateLimiter, auth.checkAuthentication, checkUser.admin,  propertyControllers.adminGetAllProperty);
/* Verify Property */
router.put("/property/:propertyId/verify", rateLimiter.commonOperationsRouteRateLimiter, auth.checkAuthentication, checkUser.admin,  propertyControllers.adminPropertyVerify);
/* unverify Property */
router.put("/property/:propertyId/unverify", rateLimiter.commonOperationsRouteRateLimiter, auth.checkAuthentication, checkUser.admin,  propertyControllers.adminPropertyUnverify);

module.exports = router;