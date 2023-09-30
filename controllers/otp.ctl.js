const otpHelper = require("../helpers/otp");
const Constant = require("../config/constant");
const db = require("../models");
const landlord = db.landlord;
const tenant = db.tenant;
let otp = {};

otp.verifyEmail = async (req,res) => {
    try {
        let {email, otp, user} = req.body;
        if((!email || !otp || !user) || !(user == 'TENANT' || user == 'LANDLORD')){
            return res.status(Constant.BAD_REQUEST).json({
                code: Constant.BAD_REQUEST,
                message: Constant.REQUEST_BAD_REQUEST
            });
        }
        
        if(otpHelper.isOtpEqualCacheOtp(email,otp)){
            if(user == 'TENANT'){
                await tenant.update({verified_email:true},{where:{email}});
            }
            else {
                await landlord.update({verified_email:true},{where:{email}});
            }
            return res.status(Constant.SUCCESS_CODE).json({
                code: Constant.SUCCESS_CODE,
                message: Constant.VERIFIED_SUCCESSFULLY
            })
        }else {
            return res.status(Constant.BAD_REQUEST).json({
                code: Constant.BAD_REQUEST,
                message: "Wrong otp!"
            })
        }
    } catch (error) {
        return res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.REQUEST_SERVER_ERROR
        });
    }
}

module.exports = otp;