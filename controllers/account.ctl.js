'use strict'
const jwt = require('jsonwebtoken');
const Constant = require("../config/constant");
const validation = require("../helpers/validation");
const bcrypt = require('bcryptjs');
const db = require('../models');
const crypto = require("crypto");
const mail = require("../helpers/mail");
const passwordHelper = require('../helpers/password');
const salt = bcrypt.genSaltSync(10);

let account = {};

account.login = async (req, res) => {
    try {
        let { email, password, role } = req.body;
        let data = await validation.userLogin({ email, password, role });
        if (data.message) {
            // Wrong Cridentials
            return res.status(Constant.INVALID_CODE).json({
                code: Constant.INVALID_CODE,
                message: data.message
            });
        }
        else {
            if (role == 'TENANT') {
                // Tenant logic
                let tenant = await db.tenant.findOne({
                    where: {
                        email: email,
                        verified_email: true
                    },
                    include: ['subscription_plans']
                });
                if (tenant && bcrypt.compareSync(password, tenant.password)) {
                    // Tenant founded
                    let sub_plan = tenant.subscription_plans.filter((d) => d.status == true);
                    let tenantData = {
                        id: tenant.id,
                        role: 'TENANT',
                        username: tenant.username,
                        email: tenant.email,
                        subscription_plan: sub_plan[0].plan_type,
                        profile_image: tenant.profile_image
                    }
                    // Add JWT-Token
                    tenantData.jwtToken = jwt.sign(tenantData, process.env.SECRET, { expiresIn: process.env.TOKEN_EXP_TIME });
                    return res.status(Constant.SUCCESS_CODE).json({
                        code: Constant.SUCCESS_CODE,
                        message: Constant.USER_LOGIN_SUCCESS,
                        data: tenantData
                    });
                }
                else {
                    // Email or Password is incorrect
                    return res.status(Constant.FORBIDDEN_CODE).json({
                        code: Constant.FORBIDDEN_CODE,
                        message: Constant.USER_EMAIL_PASSWORD
                    })
                }
            }
            else if (role == 'LANDLORD') {
                // Landlord logic
                let landlord = await db.landlord.findOne({
                    where: {
                        email: email,
                        verified_email: true
                    },
                    include: ['subscription_plans']
                });
                if (landlord && bcrypt.compareSync(password, landlord.password)) {
                    // Landlord founded
                    let sub_plan = landlord.subscription_plans.filter((d) => d.status == true);
                    let landlordData = {
                        id: landlord.id,
                        role: 'LANDLORD',
                        username: landlord.username,
                        email: landlord.email,
                        subscription_plan: sub_plan[0].plan_type,
                        profile_image: landlord.profile_image
                    }
                    // Add JWT-Token
                    landlordData.jwtToken = jwt.sign(landlordData, process.env.SECRET, { expiresIn: process.env.TOKEN_EXP_TIME });
                    return res.status(Constant.SUCCESS_CODE).json({
                        code: Constant.SUCCESS_CODE,
                        message: Constant.USER_LOGIN_SUCCESS,
                        data: landlordData
                    });
                }
                else {
                    // Email or Password is incorrect
                    return res.status(Constant.FORBIDDEN_CODE).json({
                        code: Constant.FORBIDDEN_CODE,
                        message: Constant.USER_EMAIL_PASSWORD
                    })
                }
            }
            else if (role == 'ADMIN') {
                // Admin logic
                let admin = await db.admin.findOne({
                    where: {
                        email: email
                    }
                });
                if (admin && bcrypt.compareSync(password, admin.password)) {
                    // Admin founded
                    let adminData = {
                        id: admin.id,
                        role: 'ADMIN',
                        username: admin.username,
                        email: admin.email,
                        profile_image: admin.profile_image
                    }
                    // Add JWT-Token
                    adminData.jwtToken = jwt.sign(adminData, process.env.SECRET);
                    return res.status(Constant.SUCCESS_CODE).json({
                        code: Constant.SUCCESS_CODE,
                        message: Constant.USER_LOGIN_SUCCESS,
                        data: adminData
                    });
                }
                else {
                    // Email or Password is incorrect
                    return res.status(Constant.FORBIDDEN_CODE).json({
                        code: Constant.FORBIDDEN_CODE,
                        message: Constant.USER_EMAIL_PASSWORD
                    })
                }
            }
            // Wrong Cridentials
            return res.status(Constant.INVALID_CODE).json({
                code: Constant.INVALID_CODE,
                message: data.message
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.SOMETHING_WENT_WRONG,
            data: error.message.message
        })
    }
}

account.requestPasswordReset = async (req, res) => {
    try {
        // Create Token
        let tokenBody = {
            id: req.user.id,
            role: req.user.role,
            username: req.user.username,
            email: req.user.email
        };
        let resetToken = crypto.randomBytes(32).toString("hex");
        const hash = await bcrypt.hash(resetToken + Date.now(), Number(bcrypt.genSalt()));
        
        // Cache the hash and tokenObj
        passwordHelper.cachePswdResetToken(hash, tokenBody);

        // Send Email
        let emailObj = {
            email: tokenBody.email,
            username: tokenBody.username,
            link: `${process.env.CLIENT_URL}/resetpassword?token=${hash}`
        };
        await mail.sendEmailForPasswordResetLink(emailObj);

        return res.status(Constant.SUCCESS_CODE).json({
            code: Constant.SUCCESS_CODE,
            message: Constant.PSWD_RESETLINK_GENERATED_SUCCESS
        });

    } catch (error) {
        console.log(error);
        return res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.SOMETHING_WENT_WRONG
        })
    }
}

account.resetPassword = async (req, res) => {
    try {
        // Get Token
        let { token, password } = req.body;
        if (!token || !password) {
            return res.status(Constant.BAD_REQUEST).json({
                code: Constant.BAD_REQUEST,
                message: Constant.REQUEST_BAD_REQUEST
            });
        }

        // Get Cache
        let cache = passwordHelper.getUserObj(token);
        if (!cache) {
            return res.status(Constant.BAD_REQUEST).json({
                code: Constant.BAD_REQUEST,
                message: Constant.PSWD_RESET_TIMEOUT
            });
        }

        // Reset Password
        let newPassword = bcrypt.hashSync(password, salt);

        if (cache.role === 'TENANT') {
            await db.tenant.update({ password: newPassword }, { where: { email: cache.email } });
        }
        else if (cache.role === 'LANDLORD') {
            await db.landlord.update({ password: newPassword }, { where: { email: cache.email } });
        }
        else if (cache.role === 'ADMIN') {
            await db.admin.update({ password: newPassword }, { where: { email: cache.email } });
        }

        return res.status(Constant.SUCCESS_CODE).json({
            code: Constant.SUCCESS_CODE,
            message: Constant.PSWD_CHANGED
        });

    } catch (error) {
        console.log(error);
        return res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.SOMETHING_WENT_WRONG
        })
    }
}

module.exports = account;