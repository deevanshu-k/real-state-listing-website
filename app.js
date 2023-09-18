const config = require("./config");
const http = require('http');
const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const Constant = require('./config/constant');

// parse application/json
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

// Set Static Folder
let dir = path.join(__dirname, '/public/images');
app.use('/images', express.static(dir));

// user route file
app.use("/api/register",require("./routes/register"));

// Handling non matching request from the client
app.use((req, res, next) => {
    return res.status(Constant.NOT_FOUND).json({
        code: Constant.NOT_FOUND,
        message: Constant.REQUEST_NOT_FOUND,
    })
});

if (process.env.NODE_ENV == "production") {
    console.log("Production ENV");
    httpServer = http.createServer(app);
    // for production 
    //var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
    //var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');
    //var credentials = {key: privateKey, cert: certificate};
    // var httpsServer = https.createServer(credentials, app);
} else {
    console.log("Development ENV");
    httpServer = http.createServer(app);
}

httpServer.listen(config.PORT, () => {
    console.log(`APP LISTENING ON http://${config.HOST}:${config.PORT}`);
})