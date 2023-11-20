const Constant = require("../config/constant");
const validation = require("../helpers/validation");
const { deletePropertyImages } = require("../helpers/upload");
const db = require("../models");
const { DeleteObjectsCommand } = require("@aws-sdk/client-s3");
const s3 = require("../lib/s3storage");


let property = {};

/*
    NOTE: Get Landlord ID details from
    PLANS + PROPERTY_TYPE array is already provided 
    req.user = {
        id: number,
        role: "TENANT" | "LANDLORD",
        username: string,
        email: string,
        subscription_plan: "FREETENANT"| "PREMIUMTENANT"  | "FREELANDLORD" | "STANDARDLANDLORD" | "PREMIUMLANDLORD",
        profile_image: string | null,
        iat: number,
        exp: number
    } object
*/


property.getAllProperties = async (req, res) => {
    try {
        // Return all properties of landlord ID (req.user.id) provided
        const allProperties = await db.property.findAll({ where: { landlordId: req.user.id }, include: ['images'] });

        //Check for if there's any property for this landlord, then returns the properties
        if (allProperties.length > 0) {
            const properties = allProperties.map(property => ({
                id: property.id,
                property_type: property.property_type,
                offer_type: property.offer_type,
                property_name: property.property_name,
                verification_status: property.verification_status,
                state: property.state,
                district: property.district,
                zipcode: property.zipcode,
                remark: property.remark,
                no_of_rooms: property.no_of_rooms,
                price: property.price,
                attached_kitchen: property.attached_kitchen,
                attached_bathroom: property.attached_bathroom,
                include_water_price: property.include_water_price,
                include_electricity_price: property.include_electricity_price,
                rating: property.rating,
                images: property.images.map(image => ({ // TODO: images are in sorted form
                    id: image.id,
                    img_url: image.img_url
                })) // "images" is an array of  [{ id, img_url }]
            }));

            // Return success response with the found properties
            return res.status(Constant.SUCCESS_CODE).json({
                code: Constant.SUCCESS_CODE,
                data: properties
            });
        } else {
            // if no properties were found for this landlord
            return res.status(Constant.NOT_FOUND).json({
                code: Constant.NOT_FOUND,
                message: Constant.PROPERTIES_NOT_FOUND
            });
        }

    } catch (error) {
        return res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.SOMETHING_WENT_WRONG,
        })
    }
}

property.createProperty = async (req, res) => {
    try {
        const user = req.user

        // Check If Landlord Allowed to create new property
        const propertyLimit = Constant.PLANS[user.subscription_plan].no_of_property
        const countProperty = await db.property.count({ where: { landlordId: req.user.id } });
        if (countProperty === propertyLimit) { // BUG: What is somehow more than allowed propety already exist
            return res.status(Constant.FORBIDDEN_CODE).json({
                code: Constant.FORBIDDEN_CODE,
                message: Constant.SUBSCRIPTION_PLAN_LIMIT_REACHED
            });
        }


        // Need All Required Field in req.body: 
        //  property_type,property_name,state,district,zipcode,remark,no_of_rooms,price,attached_kitchen,attached_bathroom,include_water_price,include_electricity_price
        let { property_type, offer_type, property_name, state, district, zipcode, remark, no_of_rooms, price, attached_kitchen, attached_bathroom, include_water_price, include_electricity_price } = req.body
        let data = await validation.propertyCreation({ property_type, offer_type, property_name, state, district, zipcode, remark, no_of_rooms, price, attached_kitchen, attached_bathroom, include_water_price, include_electricity_price });
        if (data.message) {
            // Wrong Data
            return res.status(Constant.BAD_REQUEST).json({
                code: Constant.BAD_REQUEST,
                message: data.message
            });
        }

        // Create Property Set  verification_status:false,rating:0 
        let propertyData = await db.property.create({
            landlordId: req.user.id,
            property_type,
            offer_type,
            property_name,
            state,
            district,
            zipcode,
            remark,
            no_of_rooms,
            price,
            attached_kitchen,
            attached_bathroom,
            include_water_price,
            include_electricity_price,
            verification_status: false,
            rating: 0,
        })

        //If property successfully created
        return res.status(Constant.SUCCESS_CODE).json({
            code: Constant.SUCCESS_CODE,
            message: Constant.SAVE_SUCCESS,
            data: {
                id: propertyData.id,
                property_name: propertyData.property_name
            }
        });
    } catch (error) {
        return res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.SOMETHING_WENT_WRONG,
        })
    }
}

property.updateProperty = async (req, res) => {
    try {
        // NOTE: propertyId ,rating is cannot be updated
        // req.body = { propertyId:number , data: { data to be updated }}
        const { propertyId, data } = req.body;

        if (!propertyId || !data) {
            return res.status(Constant.BAD_REQUEST).json({
                code: Constant.BAD_REQUEST,
                message: Constant.REQUEST_BAD_REQUEST
            });
        }
        // Finding the property by it's id
        const property = await db.property.findOne({ where: { id: propertyId } });

        if (!property) {
            return res.status(Constant.NOT_FOUND).json({
                code: Constant.NOT_FOUND,
                message: Constant.PROPERTY_NOT_FOUND,
            });
        }

        // Checking If Landlord Allowed To Update The Property
        if (property.landlordId !== req.user.id) {
            return res.status(Constant.FORBIDDEN_CODE).json({
                code: Constant.FORBIDDEN_CODE,
                message: Constant.UNAUTHORIZED_REQUEST,
            });
        }

        // Set property verification_status:false
        if (data.verification_status) {
            data.verification_status = false;
        }

        // Update the Property data
        await db.property.update(data, { // BUG: Validate Data
            where: { id: propertyId },
        });


        // If property successfully updated
        return res.status(Constant.SUCCESS_CODE).json({
            code: Constant.SUCCESS_CODE,
            message: Constant.UPDATE_SUCCESS,
        });
    } catch (error) {
        return res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.SOMETHING_WENT_WRONG,
        })
    }
}

property.deleteProperty = async (req, res) => {
    try {
        //Get propertyId from req.params
        const { propertyId } = req.params;

        // Check If Landlord Allowed To Delete The Property
        let property = await db.property.findOne({
            where: {
                id: propertyId,
                landlordId: req.user.id
            }
        });

        if (!property) {
            return res.status(Constant.NOT_FOUND).json({
                code: Constant.NOT_FOUND,
                message: Constant.PROPERTY_NOT_FOUND,
            });
        }

        // Get Images Keys
        let imagesKeys = await db.property_image.findAll({
            where: {
                propertyId: propertyId
            },
            attributes: ['key'],
            raw: true
        });
        // Delete Images
        await db.property_image.destroy({
            where: {
                propertyId: propertyId
            }
        });
        // Delete Property
        await db.property.destroy({
            where: {
                id: propertyId
            }
        });
        // Delete Images From S3
        imagesKeys = imagesKeys.map(d => {
            return {
                Key: d.key
            }
        });
        if (Array.isArray(imagesKeys) && imagesKeys.length) {
            const command = new DeleteObjectsCommand({
                Bucket: process.env.aws_bucket_name,
                Delete: {
                    Objects: imagesKeys,
                },
            });
            await s3.send(command);
        }

        return res.status(Constant.SUCCESS_CODE).json({
            code: Constant.SUCCESS_CODE,
            message: Constant.PROPERTY_DELETED
        });
    } catch (error) {
        console.log(error);
        return res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.SOMETHING_WENT_WRONG,
        })
    }
}

property.getProperty = async (req, res) => {
    try {
        //Get propertyId from req.params
        const { propertyId } = req.params;

        // Return property with specific fields found by propertyId
        const property = await db.property.findOne({
            where: { id: propertyId },
            include: {
                model: db.property_image,
                as: 'images', // Specify the alias used 
                attributes: ['id', 'img_url'],
            },
            attributes: ['id', 'offer_type', 'property_type', 'property_name', 'verification_status', 'state', 'district', 'zipcode', 'remark', 'no_of_rooms', 'price', 'attached_kitchen', 'attached_bathroom', 'include_water_price', 'include_electricity_price', 'rating']
        });

        if (property) {
            // Return success response with the found property
            return res.status(Constant.SUCCESS_CODE).json({
                code: Constant.SUCCESS_CODE,
                data: property
            });
        }
        else {
            // if no property were found
            return res.status(Constant.NOT_FOUND).json({
                code: Constant.NOT_FOUND,
                message: Constant.PROPERTY_NOT_FOUND
            });
        }

    } catch (error) {
        return res.status(Constant.SERVER_ERROR).json({
            code: Constant.SERVER_ERROR,
            message: Constant.SOMETHING_WENT_WRONG,
        })
    }
}

module.exports = property;