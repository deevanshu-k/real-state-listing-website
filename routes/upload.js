const express = require("express");
const router = express.Router();
const uploadCtl = require("../controllers/upload.ctl");
const auth = require("../middileware/auth");
const user = require("../middileware/user");
const rateLimiter = require("../middileware/rate-limit");

router.post("/profileimage", rateLimiter.commonOperationsRouteRateLimiter, auth.checkAuthentication, uploadCtl.uploadProfile);
router.post('/document/:type', rateLimiter.commonOperationsRouteRateLimiter, auth.checkAuthentication, uploadCtl.uploadDocument);
router.post('/propertyImages', rateLimiter.landlordOperationsRouteRateLimiter,auth.checkAuthentication, user.landlord, uploadCtl.uploadPropertyImage);

module.exports = router;