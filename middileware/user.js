const Constant = require("../config/constant");

let checkUser = {};

checkUser.landlord = async (req,res,next) => {
    try {
        if(req.user.role === 'LANDLORD'){
           return  next();
        }
        return res.status(Constant.INVALID_CODE).json({
            code: Constant.INVALID_CODE,
            message: Constant.UNAUTHORIZED_REQUEST
        });
    } catch (error) {
        return res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.SOMETHING_WENT_WRONG
        });
    }
}

checkUser.tenant = async (req,res,next) => {
    try {
        if(req.user.role === 'TENANT'){
           return  next();
        }
        return res.status(Constant.INVALID_CODE).json({
            code: Constant.INVALID_CODE,
            message: Constant.UNAUTHORIZED_REQUEST
        });
    } catch (error) {
        return res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.SOMETHING_WENT_WRONG
        });
    }
}

checkUser.admin = async (req,res,next) => {
    try {
        if(req.user.role === 'ADMIN'){
           return  next();
        }
        return res.status(Constant.INVALID_CODE).json({
            code: Constant.INVALID_CODE,
            message: Constant.UNAUTHORIZED_REQUEST
        });
    } catch (error) {
        return res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.SOMETHING_WENT_WRONG
        });
    }
}

module.exports = checkUser;