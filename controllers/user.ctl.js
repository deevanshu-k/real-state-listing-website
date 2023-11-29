const Constant = require("../config/constant");
const db = require("../models");

let userControllers = {};

userControllers.getUserDocuments = async (req, res) => {
    try {
        // Get User Details
        let userId = req.user.id;
        let userRole = req.user.role;

        let documents = [];
        if (userRole == 'TENANT') {
            // If tenant
            documents = await db.document.findAll({
                where: {
                    tenantId: userId
                },
                raw: true
            });
        }
        else if (userRole == 'LANDLORD') {
            // If landlord
            documents = await db.document.findAll({
                where: {
                    landlordId: userId
                },
                raw: true
            });
        }

        // Return response
        documents = documents.map(d => {
            return {
                id: d.id,
                type: d.type,
                url: d.document_url
            }
        });
        return res.json(documents);

    } catch (error) {
        console.log(error);
        return res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.SOMETHING_WENT_WRONG
        })
    }
}

userControllers.updateUserDetails = async (req, res) => {
    try {
        // Update User Details
        const userId = req.user.id;
        const userRole = req.user.role;

        // Get phone_no, address, username from the request body
        const { username, phone_no, address } = req.body;

        // Validating at least one field to update
        if (!username && !phone_no && !address) {
            return res.status(Constant.BAD_REQUEST).json({
                code: Constant.BAD_REQUEST,
                message: Constant.REQUEST_BAD_REQUEST
            });
        }

        // Validate phone_no format 
        if (phone_no && !Constant.PHONE_REGEX.test(phone_no)) {
            return res.status(Constant.BAD_REQUEST).json({
                code: Constant.BAD_REQUEST,
                message: Constant.INVALID_PHONE
            });
        }

        // Constructing the update object based on the updated fields
        const updateObject = {};
        if (username) updateObject.username = username;
        if (phone_no) updateObject.phone_no = phone_no;
        if (address) updateObject.address = address;

        let user;
        // Updating user details based on the user's role
        if (userRole === 'TENANT') {
            // If tenant
            user = await db.tenant.findOne({ where: { id: userId } });
            if (user) {
                // Update user details
                await db.tenant.update(updateObject, { where: { id: userId } });
                user = await db.tenant.findOne({ where: { id: userId } });
            }
        } else if (userRole === 'LANDLORD') {
            // If landlord
            user = await db.landlord.findOne({ where: { id: userId } });
            if (user) {
                // Update user details
                await db.landlord.update(updateObject, { where: { id: userId } });
                user = await db.landlord.findOne({ where: { id: userId } });
            }
        }

        //If user details updated successfully
        return res.status(Constant.SUCCESS_CODE).json({
            code: Constant.SUCCESS_CODE,
            message: Constant.UPDATE_SUCCESS,
        });

    } catch (error) {
        return res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.SOMETHING_WENT_WRONG
        });
    }
};


module.exports = userControllers;