const util = require('util');
const Constant = require('../config/constant');
const db = require('../models');
const upload = require('../helpers/upload');
const multer = require('multer');
let up = util.promisify(upload.uploadProfileImage.single('file'));

let uploads = {};

/*
    Update Profile Image
    USER: [ TENANT, LANDLORD, ADMIN]
*/
uploads.uploadProfile = async (req, res) => {
    try {
        await up(req,res);
        if(!req.file){
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
        if(req.user.role == 'TENANT'){
            // If tenant
            await db.tenant.update(imgData,{
                where: {
                    id: req.user.id,
                    email: req.user.email
                }
            });
        }
        else if(req.user.role == 'LANDLORD') {
            // If Landlord
            await db.landlord.update(imgData,{
                where: {
                    id: req.user.id,
                    email: req.user.email
                }
            });
        }
        else if(req.user.role == 'ADMIN') {
            // If Landlord
            await db.admin.update(imgData,{
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
        if(error instanceof multer.MulterError){
            let obj = upload.multerErrorHandler(error);
            return res.status(obj.code).json({
                code: obj.code,
                message: obj.message
            });
        }
        if(error.by == 'multer'){
            return res.status(error.code || Constant.SERVER_ERROR).json({
                code:error.code || Constant.SERVER_ERROR,
                message:error.message || Constant.SOMETHING_WENT_WRONG
            });
        }
        return res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.SOMETHING_WENT_WRONG
        });
    }
}

uploads.uploadDocuments = async (req, res) => {
    try {
        res.send("OK");
    } catch (error) {

    }
}

module.exports = uploads;