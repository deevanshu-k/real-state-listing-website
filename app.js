const config = require("./config");
const http = require('http');
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const Constant = require('./config/constant');
const schedule = require('node-schedule');
const db = require('./models');
const { Op } = require('sequelize');
const chalk = require('chalk');

// parse application/json
app.use(bodyParser.json({ limit: '50mb' }));

// CORS + BODY_PARSE
const corsOptions = {
    origin: [process.env.CLIENT_URL],
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Set Static Folder
let dir = path.join(__dirname, '/public/images');
app.use('/images', express.static(dir));

// user route file
app.use("/api/register", require("./routes/register"));
app.use("/api/login", require("./routes/login"));
app.use("/api/payment", require("./routes/payment"));
app.use("/api/property", require("./routes/property"));
app.use("/api/util", require("./routes/util"));
app.use("/api/upload", require("./routes/upload"));
app.use("/api/password", require("./routes/password"));
app.use("/api/user", require("./routes/user"));

app.use("/api/admin", require("./routes/admin"));

// Handling non matching request from the client
app.use((req, res, next) => {
    return res.status(Constant.NOT_FOUND).json({
        code: Constant.NOT_FOUND,
        message: Constant.REQUEST_NOT_FOUND,
    })
});

if (process.env.NODE_ENV == "production") {
    console.log(chalk.blueBright("Production ENV"));
    httpServer = http.createServer(app);
    // for production 
    //var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
    //var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
    //var credentials = {key: privateKey, cert: certificate};
    // var httpsServer = https.createServer(credentials, app);
} else {
    console.log(chalk.red("Development ENV"));
    httpServer = http.createServer(app);
}

httpServer.listen(config.PORT, () => {
    console.log(chalk.blueBright(`APP LISTENING ON http://${config.HOST}:${config.PORT}`));
});


// Cron-Jobs

schedule.scheduleJob('*/10 * * * *', async () => {
    console.log(chalk.red("\n\n\n--------------------------Job Running!--------------------------------"));
    console.log(chalk.redBright("Job Description : Remove un-verified email landlord and tenant"));
    let destroyedLandlord = await db.landlord.destroy({ where: { verified_email: false } });
    let destroyedTenant = await db.tenant.destroy({ where: { verified_email: false } });
    console.log(chalk.blueBright("No of landlord destroyed: " + destroyedLandlord));
    console.log(chalk.blueBright("No of tenant destroyed: " + destroyedTenant));
    console.log(chalk.red("----------------------------Job Done----------------------------------"));
});

schedule.scheduleJob('0 0 * * *',async () => {
    console.log(chalk.red("\n\n\n--------------------------Job Running!--------------------------------"));
    console.log(chalk.redBright("Job Description : Landlord Subscription Checking"));
    // Get Expired Subscriptions
    let expiredSubscriptions = await db.subscription_plan.findAll({
        where: {
            status: true,
            exp_date: {
                [Op.lte] : new Date()
            }
        },
        raw: true
    });

    let ld = [];
    expiredSubscriptions.forEach(d => {
        if(d.landlordId) ld.push(d.landlordId);
    });

    // Cancel Expired Subscription
    await db.subscription_plan.update({status:false},{
        where: {
            landlordId: ld
        }
    });

    let freeLdSubData = [];
    ld.forEach(id => {
        freeLdSubData.push({
            landlordId: id,
            plan_type: "FREELANDLORD",
            payment_id: "NA",
            order_id: "NA",
            payment_method: "NA",
            status: true
        });
    });

    // Add Default Plan
    await db.subscription_plan.bulkCreate([...freeLdSubData]);
    console.log(ld);
    console.log(chalk.blueBright("Ids of landlord : " + String(ld)));
    console.log(chalk.red("----------------------------Job Done----------------------------------"));
})