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

app.use((req,res,next) => {
    setTimeout(() => {next()},2000);
})

// user route file
app.use("/api/register",require("./routes/register"));
app.use("/api/login",require("./routes/login"));
app.use("/api/payment",require("./routes/payment"));
app.use("/api/property",require("./routes/property"));

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

schedule.scheduleJob('*/10 * * * *',async () => {
    console.log(chalk.red("\n\n\n--------------------------Job Running!--------------------------------"));
    console.log(chalk.redBright("Job Description : Remove un-verified email landlord and tenant"));
    let destroyedLandlord = await db.landlord.destroy({where:{verified_email:false}});
    let destroyedTenant = await db.tenant.destroy({where:{verified_email:false}});
    console.log(chalk.blueBright("No of landlord destroyed: " + destroyedLandlord));
    console.log(chalk.blueBright("No of tenant destroyed: " + destroyedTenant));
    console.log(chalk.red("----------------------------Job Done----------------------------------"));
});