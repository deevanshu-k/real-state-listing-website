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

userControllers.getUserDetails = async (req, res) => {
    try {
        const { role, id } = req.user;
        let userdetails = {};

        if (role === 'TENANT') {
            userdetails = await db.tenant.findOne({
                where: { id: id },
                attributes: ['id', 'username', 'email', 'phone_no', 'key', 'profile_image', 'address', 'verification_status']
            });
        }
        else if (role === 'LANDLORD') {
            userdetails = await db.landlord.findOne({
                where: { id: id },
                attributes: ['id', 'username', 'email', 'phone_no', 'key', 'profile_image', 'address', 'verification_status']
            });
        }
        else if (role === 'ADMIN') {
            userdetails = await db.admin.findOne({
                where: { id: id },
                attributes: ['id', 'username', 'email', 'key', 'profile_image']
            });
        }

        return res.status(Constant.SUCCESS_CODE).json({
            code: Constant.SUCCESS_CODE,
            data: userdetails
        });
    } catch (error) {
        console.log(error);
        return res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.SOMETHING_WENT_WRONG
        })
    }
}

/*
    Admin Controller Methods
*/
userControllers.getAllLandlords = async (req, res) => {
    try {
        let landlords = await db.landlord.findAll({
            attributes: ['id', 'username', 'email', 'phone_no', 'profile_image', 'address', 'verification_status', 'verified_email']
        });
        return res.status(Constant.SUCCESS_CODE).json(landlords);

    } catch (error) {
        console.log(error);
        return res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.SOMETHING_WENT_WRONG
        })
    }
}

userControllers.getAllTenants = async (req, res) => {
    try {
        let tenants = await db.tenant.findAll({
            attributes: ['id', 'username', 'email', 'phone_no', 'profile_image', 'address', 'verification_status', 'verified_email']
        });
        return res.status(Constant.SUCCESS_CODE).json(tenants);

    } catch (error) {
        console.log(error);
        return res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.SOMETHING_WENT_WRONG
        })
    }
}

userControllers.getLandlordDocuments = async (req, res) => {
    try {
        const { Id } = req.params;
        let documents = [];

        documents = await db.document.findAll({
            where: {
                landlordId: Id
            },
            raw: true
        });

        documents = documents.map(d => {
            return {
                id: d.id,
                type: d.type,
                url: d.document_url
            }
        });

        res.status(200).json(documents);

    } catch (error) {
        console.log(error);
        return res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.SOMETHING_WENT_WRONG
        })
    }
}

userControllers.getTenantDocuments = async (req, res) => {
    try {
        const { Id } = req.params;
        let documents = [];

        documents = await db.document.findAll({
            where: {
                tenantId: Id
            },
            raw: true
        });

        documents = documents.map(d => {
            return {
                id: d.id,
                type: d.type,
                url: d.document_url
            }
        });

        res.status(200).json(documents);

    } catch (error) {
        console.log(error);
        return res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.SOMETHING_WENT_WRONG
        })
    }
}


module.exports = userControllers;