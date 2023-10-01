let razorpay = require("../lib/payment");
let paymentHelperFnx = require("../helpers/payment");
const Constant = require("../config/constant");
const db = require("../models");

let payment = {};
let plans = {
    "PREMIUMTENANT": {
        type:"PREMIUMTENANT",
        amount: 599
    },
    "STANDARDLANDLORD": {
        type:"STANDARDLANDLORD",
        amount: 799,
        duration: 90
    },
    "PREMIUMLANDLORD": {
        type:"PREMIUMLANDLORD",
        amount: 1499,
        duration: 180
    }
};

payment.createOrder = async (req, res) => {
    try {
        let { userType , userId , planType} = req.body;
        let planData = plans[planType];
        if((userType == "LANDLORD" || userType == "TENANT") && userId && planData){  
            const options = {
                amount: planData.amount*100,
                currency: 'INR',
                receipt: paymentHelperFnx.createReceipt(userType,userId),
                partial_payment: false,
                notes: {
                    userId,
                    userType    
                }
            };
            // Create Order
            const response = await razorpay.orders.create(options);
            if(response){
                // Create Plan Data
                let data;
                if(userType == "LANDLORD"){
                    data = {
                        landlordId: userId,
                        plan_type: planData.type,
                        payment_id: response.id,
                        payment_method: "NA",
                        status: false
                    };
                }
                else{
                    data = {
                        tenantId: userId,
                        plan_type: planData.type,
                        payment_id: response.id,
                        payment_method: "NA",
                        status: false
                    };
                }
                //Create Plan
                let plan = await db.subscription_plan.create(data);
                if(plan){
                    res.status(Constant.SUCCESS_CODE).json({
                        code: Constant.SUCCESS_CODE,
                        message: "Payment order created successfully!",
                        data: {
                            key:process.env.razorpay_key_id,
                            id:response.id,
                            amount: response.amount,
                            currency: "INR",
                            notes: {
                                userId: 1,
                                userType: "TENANT"
                            }
                        }
                    });
                }
                else {
                    res.status(Constant.SERVER_ERROR).json({
                        code: Constant.SERVER_ERROR,
                        message: Constant.SOMETHING_WENT_WRONG
                    });
                }
            }
            else {
                res.status(Constant.SERVER_ERROR).json({
                    code: Constant.SERVER_ERROR,
                    message: Constant.SOMETHING_WENT_WRONG
                });
            }

        }
        else {
            // Bad Cridientials
            res.status(Constant.BAD_REQUEST).json({
                code: Constant.BAD_REQUEST,
                message: Constant.REQUEST_BAD_REQUEST
            });
        }
    } catch (error) {
        console.log(error);
        res.status(Constant.SERVER_ERROR).send({
            code: Constant.SERVER_ERROR,
            message: Constant.SOMETHING_WENT_WRONG
        });
    }
}

module.exports = payment;