const express = require("express");
const account = require("../controllers/account.ctl");
const router = express.Router();

router.post('/tenant', (req, res, next) => { req.body.role = "TENANT"; next() }, account.login);
router.post('/landlord', (req, res, next) => { req.body.role = "LANDLORD"; next() }, account.login);
router.post('/admin', (req, res, next) => { req.body.role = "ADMIN"; next() }, account.login);

module.exports = router;