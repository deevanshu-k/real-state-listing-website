const util = require('util');
const Constant = require('../config/constant');
const db = require('../models');
const upload = require('../helpers/upload');
const multer = require('multer');
const validation = require('../helpers/validation');
let up = util.promisify(upload.uploadProfileImage.single('file'));
let ud = util.promisify(upload.uploadDocument.single('file'));
let ur = util.promisify(upload.uploadPropertyImage.single('file'));

let uploads = {};

/*
    Update Profile Image
    USER: [ TENANT, LANDLORD, ADMIN]
*/
uploads.uploadProfile = async (req, res) => {
    try {
        await up(req, res);
        if (!req.file) {
            // If File Not Present
            return res.status(Constant.BAD_REQUEST).json({
                code: Constant.BAD_REQUEST,
                message: Constant.NO_IMAGE_SELECTED
            });
        }
        // Save Image
        let imgData = {
            profile_image: req.file.location,
            key: req.file.key
        };
        if (req.user.role == 'TENANT') {
            // If tenant
            await db.tenant.update(imgData, {
                where: {
                    id: req.user.id,
                    email: req.user.email
                }
            });
        }
        else if (req.user.role == 'LANDLORD') {
            // If Landlord
            await db.landlord.update(imgData, {
                where: {
                    id: req.user.id,
                    email: req.user.email
                }
            });
        }
        else if (req.user.role == 'ADMIN') {
            // If Landlord
            await db.admin.update(imgData, {
                where: {
                    id: req.user.id,
                    email: req.user.email
                }
            });
        }
        return res.status(Constant.SUCCESS_CODE).json({
            code: Constant.SUCCESS_CODE,
            message: Constant.PROFILEIMAGE_UPDATED,
            data: {
                url: imgData.profile_image
            }
        });
    } catch (error) {
        console.log(error);
        if (error instanceof multer.MulterError) {
            let obj = upload.multerErrorHandler(error);
            return res.status(obj.code).json({
                code: obj.code,
                message: obj.message
            });
        }
        if (error.by == 'multer') {
            return res.status(error.code || Constant.SERVER_ERROR).json({
                code: error.code || Constant.SERVER_ERROR,
                message: error.message || Constant.SOMETHING_WENT_WRONG
            });
        }
        return res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.SOMETHING_WENT_WRONG
        });
    }
}

uploads.uploadDocument = async (req, res) => {
    try {
        // docTypes From Constant
        let docType = Constant.DOCS[req.user.role];
        if (!docType.includes(req.params.type)) {
            // If Doc Type Is Not Correct
            return res.status(Constant.BAD_REQUEST).json({
                code: Constant.BAD_REQUEST,
                message: Constant.REQUEST_BAD_REQUEST
            });
        }

        // Upload To S3
        await ud(req, res);
        if (!req.file) {
            // If File Not Present
            return res.status(Constant.BAD_REQUEST).json({
                code: Constant.BAD_REQUEST,
                message: Constant.NO_DOCUMENT_SELECTED
            });
        }

        // Save Document
        let docData = {
            type: req.params.type,
            document_url: req.file.location,
            key: req.file.key
        };
        if (req.user.role === 'TENANT') {
            // If Tenant
            docData.tenantId = req.user.id;
            // Save/Update Document
            await updateOrCreateData(db.document, { tenantId: req.user.id, type: req.params.type }, docData);
        }
        else if (req.user.role === 'LANDLORD') {
            // If Landlord
            docData.landlordId = req.user.id;
            // Save/Update Document
            await updateOrCreateData(db.document, { landlordId: req.user.id, type: req.params.type }, docData);
        }


        return res.status(Constant.SUCCESS_CODE).json({
            code: Constant.SUCCESS_CODE,
            message: Constant.DOCUMENT_UPDATED,
            data: {
                url: docData.document_url
            }
        });
    } catch (error) {
        console.log(error);
        if (error instanceof multer.MulterError) {
            let obj = upload.multerErrorHandler(error);
            return res.status(obj.code).json({
                code: obj.code,
                message: obj.message
            });
        }
        if (error.by == 'multer') {
            return res.status(error.code || Constant.SERVER_ERROR).json({
                code: error.code || Constant.SERVER_ERROR,
                message: error.message || Constant.SOMETHING_WENT_WRONG
            });
        }
        return res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.SOMETHING_WENT_WRONG
        });
    }
}

uploads.uploadPropertyImage = async (req, res) => {
    try {
        // Check MetaData Required
        let { propertyId, imageNo } = req.query;
        let data = await validation.uploadPropertyImage({ propertyId, imageNo });
        if (data.message) {
            // Wrong Data
            return res.status(Constant.BAD_REQUEST).json({
                code: Constant.BAD_REQUEST,
                message: data.message
            });
        }
        // Check If this Property Belong To Requested Landlord
        let property = await db.property.findOne({
            where: {
                id: propertyId,
                landlordId: req.user.id
            }
        });
        if (!property) {
            return res.status(Constant.BAD_REQUEST).json({
                code: Constant.BAD_REQUEST,
                message: Constant.PROPERTY_UNAUTH_ACCESS
            });
        }
        // Upload To S3
        await ur(req, res);
        if (!req.file) {
            // If File Not Present
            return res.status(Constant.BAD_REQUEST).json({
                code: Constant.BAD_REQUEST,
                message: Constant.NO_PROPERTY_IMAGE_SELECTED
            });
        }
        // Save To DB
        let imgData = {
            propertyId: propertyId,
            img_url: req.file.location,
            key: req.file.key
        };
        const foundItem = await db.property_image.findOne({ where: { propertyId: imgData.propertyId, key: imgData.key } });
        let Imgdata = foundItem;
        if(!foundItem){
            Imgdata = await db.property_image.create(imgData);
        }

        // Return SUCCESS
        return res.status(Constant.SUCCESS_CODE).json({
            code: Constant.SUCCESS_CODE,
            message: Constant.PROPERTY_IMAGEADDED,
            data: {
                id: Imgdata.id,
                img_url: imgData.img_url
            }
        });

    } catch (error) {
        console.log(error);
        if (error instanceof multer.MulterError) {
            let obj = upload.multerErrorHandler(error);
            return res.status(obj.code).json({
                code: obj.code,
                message: obj.message
            });
        }
        if (error.by == 'multer') {
            return res.status(error.code || Constant.SERVER_ERROR).json({
                code: error.code || Constant.SERVER_ERROR,
                message: error.message || Constant.SOMETHING_WENT_WRONG
            });
        }
        return res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.SOMETHING_WENT_WRONG
        });
    }
}


async function updateOrCreateData(model, where, newItem) {
    // First try to find the record
    const foundItem = await model.findOne({ where });
    if (!foundItem) {
        // Item not found, create a new one
        const item = await model.create(newItem)
        return { item, created: true };
    }
    // Found an item, update it
    const item = await model.update(newItem, { where });
    return { item, created: false };
}

module.exports = uploads;