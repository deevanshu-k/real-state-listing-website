const Joi = require('joi');
const { PROPERTY_TYPE, NO_OF_IMAGES_PER_PROPERTY, OFFER_TYPE, PROPERTY_ADDIMAGE_LIMIT_EXCEED } = require('../config/constant.js');
var validation = {};

validation.userLogin = async (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        role: Joi.string().required()
    });
    try {
        const value = await schema.validateAsync(data);
        return value;
    }
    catch (err) {
        return err;
    }
};


validation.propertyCreation = async (data) => {
    const schema = Joi.object({
        property_type: Joi.string().valid(...PROPERTY_TYPE).required(),
        offer_type: Joi.string().valid(...OFFER_TYPE).required(),
        property_name: Joi.string().required(),
        state: Joi.string().required(),
        district: Joi.string().required(),
        zipcode: Joi.number().integer().required(),
        remark: Joi.string(),
        no_of_rooms: Joi.number().integer().min(1).required(),
        price: Joi.number().min(0).required(),
        attached_kitchen: Joi.boolean().required(),
        attached_bathroom: Joi.boolean().required(),
        include_water_price: Joi.boolean().required(),
        include_electricity_price: Joi.boolean().required(),
    });
    try {
        const value = await schema.validateAsync(data);
        return value;
    } catch (err) {
        return err;
    }
};

validation.uploadPropertyImage = async (data) => {
    const schema = Joi.object({
        propertyId: Joi.number().required(),
        imageNo: Joi.number().min(1).max(NO_OF_IMAGES_PER_PROPERTY).required().messages({ 'number.max': PROPERTY_ADDIMAGE_LIMIT_EXCEED })
    });
    try {
        const value = await schema.validateAsync(data);
        return value;
    } catch (err) {
        return err;
    }
};

module.exports = validation;