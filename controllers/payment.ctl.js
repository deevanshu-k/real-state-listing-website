let razorpay = require("../lib/payment");
let paymentHelperFnx = require("../helpers/payment");
const Constant = require("../config/constant");
const crypto = require('crypto');
const db = require("../models");

let payment = {};
let plans = {
    "PREMIUMTENANT": {
        type: "PREMIUMTENANT",
        amount: 599
    },
    "STANDARDLANDLORD": {
        type: "STANDARDLANDLORD",
        amount: 799,
        duration: 90
    },
    "PREMIUMLANDLORD": {
        type: "PREMIUMLANDLORD",
        amount: 1499,
        duration: 180
    }
};

payment.createOrder = async (req, res) => {
    try {
        let { planType } = req.body;
        let userId = req.user.id;
        let userType = req.user.role;
        let planData = plans[planType];
        if ((userType == "LANDLORD" || userType == "TENANT") && userId && planData) {
            const options = {
                amount: planData.amount * 100,
                currency: 'INR',
                receipt: paymentHelperFnx.createReceipt(userType, userId),
                partial_payment: false,
                notes: {
                    userId,
                    userType
                }
            };
            // Create Order
            const response = await razorpay.orders.create(options);
            if (response) {
                // Create Plan Data
                let data;
                if (userType == "LANDLORD") {
                    let expDate = new Date();
                    expDate.setDate(expDate.getDate() + planData.duration);
                    data = {
                        landlordId: userId,
                        plan_type: planData.type,
                        payment_id: "NA",
                        order_id: response.id,
                        payment_method: "NA",
                        exp_date: expDate,
                        status: false
                    };
                }
                else {
                    data = {
                        tenantId: userId,
                        plan_type: planData.type,
                        payment_id: "NA",
                        order_id: response.id,
                        payment_method: "NA",
                        status: false
                    };
                }
                //Create Plan
                let plan = await db.subscription_plan.create(data);
                if (plan) {
                    res.status(Constant.SUCCESS_CODE).json({
                        code: Constant.SUCCESS_CODE,
                        message: "Payment order created successfully!",
                        data: {
                            key: process.env.razorpay_key_id,
                            id: response.id,
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
payment.orderPaidWebhook = async (req, res) => {
    try {
        // do a validation
        const data = crypto.createHmac('sha256', process.env.razorpay_webhook_secret);
        data.update(JSON.stringify(req.body));
        const digest = data.digest('hex');
        if (digest === req.headers['x-razorpay-signature']) {
            console.log('request is legit');
            let paymentEntity = req.body.payload.payment.entity;
            let orderEntity = req.body.payload.order.entity;
            console.log(paymentEntity);
            console.log(orderEntity);
            // we can store detail in db and send the response
            if (req.body.payload.order.entity) {
                // New Payment Is Done
                if(orderEntity.notes.userType == 'LANDLORD'){
                    await db.subscription_plan.update({status:false},{where: { landlordId: orderEntity.notes.userId }});
                }
                else {
                    await db.subscription_plan.update({status:false},{where: { tenantId: orderEntity.notes.userId }});
                }
                
                db.subscription_plan.update(
                    { payment_id: paymentEntity.id, payment_method: paymentEntity.method, status: true },
                    {
                        where: { order_id: orderEntity.id }
                    })
                    .then(d => {
                        console.log("Order Captured Successfully !");
                        res.status(200).json({
                            status: 'ok'
                        })
                    })
                    .catch(e => {
                        console.log(e);
                        console.log("Can't Update In Table!");
                        res.status(500).send('Internal Error !');
                    })
            }
        } else {
            console.log('Invalid signature');
            res.status(400).send('Invalid signature');
        }
    } catch (error) {
        res.status(500).send('Server Error !');
    }
}

module.exports = payment;