const Constant = require("../config/constant");
const validation = require("../helpers/validation");
const db = require("../models");


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


property.getAllProperties = async (req,res) => {
    try {
        // Return all properties of landlord ID (req.user.id) provided
        const allProperties = await db.property.findAll({ where: { landlordId: req.user.id } });

        // if no properties were found for this landlord
        if(allProperties.length===0){
            return res.status(Constant.NOT_FOUND).json({
                code: Constant.NOT_FOUND,
                message: Constant.PROPERTIES_NOT_FOUND
            });
        }

        // Return success response with the found properties
        return res.status(Constant.SUCCESS_CODE).json({
            code: Constant.SUCCESS_CODE,
            data: allProperties
        });

       
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
        if (countProperty === propertyLimit) {
            return res.status(Constant.FORBIDDEN_CODE).json({
                code: Constant.FORBIDDEN_CODE,
                message: Constant.SUBSCRIPTION_PLAN_LIMIT_REACHED
            });
        }


        // Need All Required Field in req.body: 
        //  property_type,property_name,state,district,zipcode,remark,no_of_rooms,price,attached_kitchen,attached_bathroom,include_water_price,include_electricity_price
        let { property_type, property_name, state, district, zipcode, remark, no_of_rooms, price, attached_kitchen, attached_bathroom, include_water_price, include_electricity_price } = req.body
        let data = await validation.propertyCreation({ property_type, property_name, state, district, zipcode, remark, no_of_rooms, price, attached_kitchen, attached_bathroom, include_water_price, include_electricity_price });
        if (data.message) {
            // Wrong Data
            return res.status(Constant.BAD_REQUEST).json({
                code: Constant.BAD_REQUEST,
                message: data.message
            });
        }

        // Create Property Set  verification_status:false,rating:0 
        await db.property.create({
            landlordId: req.user.id,
            property_type,
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
        await db.property.update(data, {
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

property.deleteProperty = async (req,res) => {
    // req.body = { propertyId:number }
    // Check If Landlord Allowed To Delete The Property
    // Delete Property And Their Images In Property_Images Table + In S3 Bucket
    return res.send("OK");
}

module.exports = property;