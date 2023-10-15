

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
    // Return all properties of landlord ID (req.user.id) provided
    return res.send("OK");
}

property.createProperty = async (req,res) => {
    // Check If Landlord Allowed to create new property
    // Need All Required Field in req.body: 
    //  property_type,property_name,state,district,zipcode,remark,no_of_rooms,price,attached_kitchen,attached_bathroom,include_water_price,include_electricity_price
    // Create Property Set  verification_status:false,rating:0 
    return res.send("OK");
}

property.updateProperty = async (req,res) => {
    // NOTE: propertyId ,rating is cannot be updated
    // req.body = { propertyId:number , data: { data to be updated }}
    // Check If Landlord Allowed To Update The Property
    // Update the Property data
    // Set property verification_status:false
    return res.send("OK");
}

property.deleteProperty = async (req,res) => {
    // req.body = { propertyId:number }
    // Check If Landlord Allowed To Delete The Property
    // Delete Property And Their Images In Property_Images Table + In S3 Bucket
    return res.send("OK");
}

module.exports = property;