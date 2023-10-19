const express = require("express");
const router = express.Router();
const uploadCtl = require("../controllers/upload.ctl");
const auth = require("../middileware/auth");
const user = require("../middileware/user");
const rateLimiter = require("../middileware/rate-limit");

router.post("/profileimage", rateLimiter.commonOperationsRouteRateLimiter, auth.checkAuthentication, uploadCtl.uploadProfile);
router.post('/documents', rateLimiter.commonOperationsRouteRateLimiter, auth.checkAuthentication, uploadCtl.uploadDocuments);
router.post('/roomImages', rateLimiter.landlordOperationsRouteRateLimiter,auth.checkAuthentication, user.landlord, uploadCtl.uploadDocuments);

module.exports = router;