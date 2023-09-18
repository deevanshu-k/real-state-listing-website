const Constant = require("../config/constant");
const db = require("../models");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

let tenant = {};

tenant.register = async (req, res) => {
    try {
        // Check for required inputs
        let { username, email, password, address } = req.body;
        if (!username || !email || !password || !address) {
            throw {
                code: Constant.BAD_REQUEST,
                message: Constant.REQUEST_BAD_REQUEST
            }
        }
        password = bcrypt.hashSync(password,salt);

        // Create tenant with subscription association
        let tenant = await db.tenant.create({
            username,
            email,
            password,
            subscription_plan: {
                plan_type: "FREETENANT",
                payment_id: "NA",
                payment_method: "NA",
            },
            address,
            verification_status: false
        }, {
            include: [
                {
                    model: db.subscription_plan, as: "subscription_plan"
                }
            ],
        });

        // Check For Tenant Created
        if (tenant) {
            return res.status(Constant.SUCCESS_CODE).json({
                code: Constant.SUCCESS_CODE,
                message: Constant.SAVE_SUCCESS,
                data: {
                    username : tenant.username,
                    email : tenant.email,
                    plan : tenant.subscription_plan.plan_type,
                    verification_status : tenant.verification_status,
                    address : tenant.address
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
        if(error.name == 'SequelizeUniqueConstraintError'){
            return res.status(Constant.BAD_REQUEST).json({
                code: Constant.BAD_REQUEST,
                message: Constant.EMAIL_ALREADY_REGISTERED
            });
        }
        // If Custom Error Thrown
        if (error.code || error.message) {
            return res.json(error);
        }
        return res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.REQUEST_SERVER_ERROR
        });
    }
}

module.exports = tenant;