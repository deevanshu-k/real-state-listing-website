const dbConfig = require("../config/db.config");
const bcrypt = require('bcryptjs');
let Sequelize = require("sequelize");
let initModels = require("./init-models").initModels;

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
            let tOnj = {
                username: "Test Sharma",
                email: "deevanshukushwah80@gmail.com",
                password: bcrypt.hashSync("Tenant@123456"),
                subscription_plans: {
                    plan_type: "FREETENANT",
                    payment_id: "NA",
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
        }
    } catch (error) {
        console.log(error);
    }
})()

module.exports = models;