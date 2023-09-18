const Constant = require("../config/constant");
const db = require("../models");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

let landlord = {};

landlord.register = async (req,res) => {
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

        // Create landlord with subscription association
        let landlordData = await db.landlord.create({
            username,
            email,
            password,
            subscription_plan: {
                plan_type: "FREELANDLORD",
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

        // Check For Landlord Created
        if (landlordData) {
            return res.status(Constant.SUCCESS_CODE).json({
                code: Constant.SUCCESS_CODE,
                message: Constant.SAVE_SUCCESS,
                data: {
                    username : landlordData.username,
                    email : landlordData.email,
                    plan : landlordData.subscription_plan.plan_type,
                    verification_status : landlordData.verification_status,
                    address : landlordData.address
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
        // If Landlord Already Exist
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

module.exports = landlord;