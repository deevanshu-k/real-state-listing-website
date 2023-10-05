const Constant = require("../config/constant");
const jwt = require("jsonwebtoken");

let auth = {};

/*
    Only For Checking If Token Is Valid Or Not
*/
auth.checkAuthentication = async (req, res, next) => {
    try {
        // Get Token
        const { authorization } = req.headers;
        if (!authorization) {
            // If Token Not Found
            return res.status(Constant.INVALID_CODE).json({
                code: Constant.INVALID_CODE,
                message: Constant.USER_TOKEN_NOTFOUND
            });
        }
        // Authorize Token
        const decoded = jwt.verify(authorization, process.env.SECRET);
        if(process.env.NODE_ENV == 'development') console.log(decoded);
        // Set Decoded For Next Middleware
        req.user = decoded;
        // Go To Next Middleware
        next();
    } catch (error) {
        // If Token Is Unauthorized
        return res.status(Constant.INVALID_CODE).json({
            code: Constant.INVALID_CODE,
            message: Constant.USER_TOKEN_EXPIRED
        });
    }
}

module.exports = auth;