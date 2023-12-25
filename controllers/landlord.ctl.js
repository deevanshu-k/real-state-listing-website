const Constant = require("../config/constant");
const mail = require("../helpers/mail");
const db = require("../models");
const otpHelper = require("../helpers/otp");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

let landlord = {};

landlord.register = async (req, res) => {
    try {
        // Check for required inputs
        let { username, email, password, address, phone_no } = req.body;
        if (!username || !email || !password || !address || !phone_no) {
            return res.status(Constant.BAD_REQUEST).json({
                code: Constant.BAD_REQUEST,
                message: Constant.REQUEST_BAD_REQUEST
            });
        }
        password = bcrypt.hashSync(password, salt);

        // If User Already Exist With Not Verified Email
        let landlordData = await db.landlord.findOne({ where: { email: email, verified_email: false } });
        if (landlordData) {
            // Send Email For Otp
            let otp = otpHelper.createOtpAndCacheOtp(email, 4);
            await mail.sendEmailVerificationOtpEmail({ email, username: landlordData.username, otp });
            // Redirect to email verification
            return res.status(Constant.SUCCESS_CODE).json({
                code: Constant.SUCCESS_CODE,
                message: "Email already exist, " + Constant.VERIFY_EMAIL,
                data: {
                    username: landlordData.username,
                    email: email
                }
            });
        }

        // Create landlord with subscription association
        landlordData = await db.landlord.create({
            username,
            email,
            phone_no,
            password,
            subscription_plans: [{
                plan_type: "FREELANDLORD",
                payment_id: "NA",
                order_id: "NA",
                payment_method: "NA",
                status: true
            }],
            address,
            verification_status: false,
            verified_email: false
        }, {
            include: [
                {
                    model: db.subscription_plan, as: "subscription_plans"
                }
            ],
        });

        // Check For Landlord Created
        if (landlordData) {
            // Send Email For Otp
            let otp = otpHelper.createOtpAndCacheOtp(email, 4);
            await mail.sendEmailVerificationOtpEmail({ email, username: landlordData.username, otp });
            // Redirect to email verification
            return res.status(Constant.SUCCESS_CODE).json({
                code: Constant.SUCCESS_CODE,
                message: Constant.VERIFY_EMAIL,
                data: {
                    username: landlordData.username,
                    email: landlordData.email,
                }
            });
        }
        else {
            throw {
                code: Constant.SERVER_ERROR,
                message: Constant.REQUEST_SERVER_ERROR
            }
        }
    } catch (error) {
        console.log(error);
        // If Landlord Already Exist
        if (error.name == 'SequelizeUniqueConstraintError') {
            return res.status(Constant.BAD_REQUEST).json({
                code: Constant.BAD_REQUEST,
                message: Constant.EMAIL_ALREADY_REGISTERED
            });
        }

        return res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.REQUEST_SERVER_ERROR
        });
    }
}

/* Admin */
landlord.adminLandlordVerify = async (req, res) => {
    try {
        // Get landlordId
        const { landlordId } = req.params;
        
        // Verify Landlord
        await db.landlord.update({
            verification_status: true
        }, {
            where: {
                id: landlordId
            }
        });

        // Get Landlord
        const landlord = await db.landlord.findOne({
            where: {
                id: landlordId
            }
        });

        // Send Mail
        await mail.sendEmailToLandlordAsLandlordIsVerified({
            email: landlord.email,
            username: landlord.username
        });

        // Successfully Unverified
        return res.status(Constant.SUCCESS_CODE).json({
            code: Constant.SUCCESS_CODE,
            message: Constant.UPDATE_SUCCESS
        });
    } catch (error) {
        console.log(error);
        return res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.SOMETHING_WENT_WRONG,
        })
    }
}

landlord.adminLandlordUnverify = async (req, res) => {
    try {
        // Get landlordId
        const { landlordId } = req.params;
        
        // Unverify Landlord
        await db.landlord.update({
            verification_status: false
        }, {
            where: {
                id: landlordId
            }
        });

        // Successfully Unverified
        return res.status(Constant.SUCCESS_CODE).json({
            code: Constant.SUCCESS_CODE,
            message: Constant.UPDATE_SUCCESS
        });
    } catch (error) {
        console.log(error);
        return res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.SOMETHING_WENT_WRONG,
        })
    }
}

module.exports = landlord;