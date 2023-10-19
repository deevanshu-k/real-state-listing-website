const multerS3 = require('multer-s3');
const multer = require('multer');
const path = require('path');
const s3 = require('../lib/s3storage');
const Constant = require('../config/constant');
const md5 = require('md5');

/*
    Before This Upload Check If property is of landlord
    Required: propertyId in req.body
*/

let upload = {};

upload.uploadProfileImage = multer({
    limits: { fileSize: 5 * 1024 * 1024 },
    storage: multerS3({
        s3,
        acl: 'public-read',
        bucket: process.env.aws_bucket_name,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const fileName = md5(req.user.email);
            cb(null, fileName);
        }
    }),
    fileFilter: function (req, file, cb) {
        const fileRegex = new RegExp('\.(jpg|jpeg|png)$');
        const fileMime = file.mimetype;
        if (!fileMime.match(fileRegex)) {
            //throw exception
            return cb({ code: Constant.BAD_REQUEST, message: Constant.INVALID_IMAGE_TYPE, by: "multer" });
        }
        //pass the file
        cb(null, true);
    }
});

upload.uploadDocument = multer({
    limits: { fileSize: 5 * 1024 * 1024 },
    storage: multerS3({
        s3,
        acl: 'public-read',
        bucket: process.env.aws_bucket_name,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const fileEmailHash = md5(req.user.email);
            const type = req.params.type;
            cb(null, `docs_${type}_${fileEmailHash}${path.extname(file.originalname)}`);
        }
    }),
    fileFilter: function (req, file, cb) {
        const fileRegex = new RegExp('\.(jpg|jpeg|png|pdf)$');
        const fileMime = file.mimetype;
        if (!fileMime.match(fileRegex)) {
            //throw exception
            return cb({ code: Constant.BAD_REQUEST, message: Constant.INVALID_DOCUMENT_TYPE, by: "multer" });
        }
        //pass the file
        cb(null, true);
    }
});

upload.multerErrorHandler = (err) => {
    // PENDING: Other Type Of Multer Error
    // https://github.com/expressjs/multer/blob/master/lib/multer-error.js
    // err = { code , field}
    return {
        code: Constant.BAD_REQUEST,
        message: err.message
    }
}

module.exports = upload;