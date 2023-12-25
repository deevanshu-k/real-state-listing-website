const dbConfig = require("../config/db.config");
const bcrypt = require('bcryptjs');
let Sequelize = require("sequelize");
let initModels = require("./init-models").initModels;
let jwt = require("jsonwebtoken");

// create sequelize instance with database connection
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,
    logging: dbConfig.logging,
    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
});

// load the model definitions into sequelize

var models = initModels(sequelize);

models.sequelize = sequelize;
models.Sequelize = Sequelize;

(async () => {
    try {
        await models.sequelize.sync({ force: true });
        if (process.env.NODE_ENV == 'development') {
            let devValues = [];

            let aOnj = {
                username: "Test Dubey",
                email: "deevanshukushwah80@gmail.com",
                password: bcrypt.hashSync("Admin@123456")
            };
            let admin = await models.admin.create(aOnj);
            adminToken = jwt.sign({
                id: admin.id,
                role: 'ADMIN',
                username: admin.username,
                email: admin.email,
                profile_image: admin.profile_image
            }, process.env.SECRET, { expiresIn: '24h' });
            devValues.push({
                user: "ADMIN",
                token: adminToken
            });

            let expDate = new Date();
            // expDate.setDate(expDate.getDate() + );
            let lOnj = {
                username: "Test Yadav",
                email: "astroboiscosmos@gmail.com",
                phone_no: "7689543216",
                password: bcrypt.hashSync("Landlord@123456"),
                subscription_plans: {
                    plan_type: "STANDARDLANDLORD",
                    payment_id: "NA",
                    order_id: "NA",
                    exp_date: expDate,
                    payment_method: "NA",
                    status: true
                },
                address: "122 bhagirath colony dharnaka",
                verification_status: true,
                verified_email: true
            }
            let landlord = await models.landlord.create(lOnj, {
                include: [
                    {
                        model: models.subscription_plan, as: "subscription_plans"
                    }
                ]
            });
            lOnj.email = "abc@gmail.com"
            lOnj.verification_status = false;
            await models.landlord.create(lOnj, {
                include: [
                    {
                        model: models.subscription_plan, as: "subscription_plans"
                    }
                ]
            });

            let landlordData = {
                id: landlord.id,
                role: 'LANDLORD',
                username: landlord.username,
                email: landlord.email,
                phone_no: landlord.phone_no,
                subscription_plan: landlord.subscription_plans[0].plan_type,
                profile_image: landlord.profile_image
            }
            landlordToken = jwt.sign(landlordData, process.env.SECRET, { expiresIn: '24h' });
            devValues.push({
                user: "LANDLORD",
                token: landlordToken
            });

            let tOnj = {
                username: "Test Sharma",
                email: "deevanshukushwah80@gmail.com",
                phone_no: "7689543216",
                password: bcrypt.hashSync("Tenant@123456"),
                subscription_plans: {
                    plan_type: "PREMIUMTENANT",
                    payment_id: "NA",
                    order_id: "NA",
                    exp_date: expDate,
                    payment_method: "NA",
                    status: true
                },
                address: "122 bhagirath colony dharnaka",
                verification_status: false,
                verified_email: true
            }
            let tenant = await models.tenant.create(tOnj, {
                include: [
                    {
                        model: models.subscription_plan, as: "subscription_plans"
                    }
                ]
            });

            let tenantData = {
                id: tenant.id,
                role: 'TENANT',
                username: tenant.username,
                email: tenant.email,
                phone_no: tenant.phone_no,
                subscription_plan: tenant.subscription_plans[0].plan_type,
                profile_image: tenant.profile_image
            }

            tenantToken = jwt.sign(tenantData, process.env.SECRET, { expiresIn: '24h' });
            devValues.push({
                user: "TENANT",
                token: tenantToken
            });

            // Add Sample Properties
            await models.property.bulkCreate([
                {
                    landlordId: 1,
                    property_type: "HOUSE",
                    offer_type: "SELL",
                    property_name: "Cozy Cottage",
                    publish_status: true,
                    verification_status: true,
                    state: "Andaman and Nicobar Islands",
                    district: "South Andaman",
                    zipcode: 90001,
                    remark: "A lovely cottage in a quiet neighborhood.",
                    no_of_rooms: 3,
                    price: 250000,
                    attached_kitchen: true,
                    attached_bathroom: true,
                    include_water_price: true,
                    include_electricity_price: true,
                    rating: 4.5
                },
                {
                    landlordId: 1,
                    property_type: "ROOM",
                    offer_type: "RENT",
                    property_name: "Luxury Penthouse",
                    publish_status: true,
                    verification_status: true,
                    state: "Andhra Pradesh",
                    district: "Addanki",
                    zipcode: 10001,
                    remark: "Stunning penthouse with city views.",
                    no_of_rooms: 4,
                    price: 6000,
                    attached_kitchen: true,
                    attached_bathroom: true,
                    include_water_price: true,
                    include_electricity_price: true,
                    rating: 4.8
                },
                {
                    landlordId: 1,
                    property_type: "HOUSE",
                    offer_type: "SELL",
                    property_name: "Modern Condo",
                    publish_status: false,
                    verification_status: true,
                    state: "Assam",
                    district: "Bihpuriagaon",
                    zipcode: 33101,
                    remark: "Sleek and modern condo in the heart of the city.",
                    no_of_rooms: 2,
                    price: 350000,
                    attached_kitchen: true,
                    attached_bathroom: true,
                    include_water_price: true,
                    include_electricity_price: true,
                    rating: 4.7
                },
                {
                    landlordId: 1,
                    property_type: "SHOP",
                    offer_type: "RENT",
                    property_name: "Family Home",
                    publish_status: false,
                    verification_status: true,
                    state: "Assam",
                    district: "Bihpuriagaon",
                    zipcode: 77001,
                    remark: "Spacious family home with a large backyard.",
                    no_of_rooms: 5,
                    price: 2000,
                    attached_kitchen: true,
                    attached_bathroom: true,
                    include_water_price: true,
                    include_electricity_price: true,
                    rating: 4.4
                }
            ]);

            // Dev Tokens For Api Testing
            if (devValues.length) console.log("\n---------------------------Dev-Tokens : Use This Token For Dev Testing--------------------------->");
            devValues.forEach(d => {
                console.log(d.user + " : " + d.token);
                if (d != devValues[devValues.length - 1]) console.log("\n");
            })
            if (devValues.length) console.log("---------------------------------------------------------------------------------------------------->\n");
        }
    } catch (error) {
        console.log(error);
    }
})()

module.exports = models;