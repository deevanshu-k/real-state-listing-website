const Constant = require("../config/constant");
const mail = require("../helpers/mail");
const db = require("../models");
const otpHelper = require("../helpers/otp");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

let tenant = {};

tenant.register = async (req, res) => {
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
        let tenantData = await db.tenant.findOne({ where: { email: email, verified_email: false } });
        if (tenantData) {
            // Send Email For Otp
            let otp = otpHelper.createOtpAndCacheOtp(email, 4);
            await mail.sendEmailVerificationOtpEmail({ email, username: tenantData.username, otp });
            // Redirect to email verification
            return res.status(Constant.SUCCESS_CODE).json({
                code: Constant.SUCCESS_CODE,
                message: "Email already exist, " + Constant.VERIFY_EMAIL,
                data: {
                    username: tenantData.username,
                    email: email
                }
            });
        }

        // Create tenant with subscription association
        tenantData = await db.tenant.create({
            username,
            email,
            phone_no,
            password,
            subscription_plans: [{
                plan_type: "FREETENANT",
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

        // Check For Tenant Created
        if (tenantData) {
            // Send Email For Otp
            let otp = otpHelper.createOtpAndCacheOtp(email, 4);
            await mail.sendEmailVerificationOtpEmail({ email, username: tenantData.username, otp });
            // Redirect to email verification
            return res.status(Constant.SUCCESS_CODE).json({
                code: Constant.SUCCESS_CODE,
                message: Constant.VERIFY_EMAIL,
                data: {
                    username: tenantData.username,
                    email: tenantData.email,
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
        // If Tenant Already Exist
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
tenant.adminverify = async (req, res) => {
    // Set tenant verification_status = true
    // Send mail to tentant
}

tenant.adminunverify = async (req, res) => {
    // Set tenant verification_status = false
    // Send mail to tentant
}

module.exports = tenant;