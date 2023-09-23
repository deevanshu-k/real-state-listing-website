const Joi = require('joi');
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

module.exports = validation;