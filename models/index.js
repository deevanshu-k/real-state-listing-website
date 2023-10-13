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
            let lOnj = {
                username: "Test Yadav",
                email: "astroboiscosmos@gmail.com",
                password: bcrypt.hashSync("Landlord@123456"),
                subscription_plans: {
                    plan_type: "FREELANDLORD",
                    payment_id: "NA",
                    order_id: "NA",
                    payment_method: "NA",
                    status: true
                },
                address: "122 bhagirath colony dharnaka",
                verification_status: false,
                verified_email: true
            }
            let landlord = await models.landlord.create(lOnj, {
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
                password: bcrypt.hashSync("Tenant@123456"),
                subscription_plans: {
                    plan_type: "FREETENANT",
                    payment_id: "NA",
                    order_id: "NA",
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
                subscription_plan: tenant.subscription_plans[0].plan_type,
                profile_image: tenant.profile_image
            }

            tenantToken = jwt.sign(tenantData, process.env.SECRET, { expiresIn: '24h' });
            devValues.push({
                user: "TENANT",
                token: tenantToken
            });

            // Dev Tokens For Api Testing
            if (devValues.length) console.log("\n---------------------------Dev-Tokens : Use This Token For Dev Testing--------------------------->");
            devValues.forEach(d => {
                console.log(d.user + " : " + d.token);
                if(d != devValues[devValues.length-1]) console.log("\n");
            })
            if (devValues.length) console.log("---------------------------------------------------------------------------------------------------->\n");
        }
    } catch (error) {
        console.log(error);
    }
})()

module.exports = models;