const fs = require("fs");

module.exports = {
    cert: fs.readFileSync(__dirname + "/cert.crt"),
    key: fs.readFileSync(__dirname + "/cert.key"),
    passphrase: "12345"
};


// usage: live-server --https=keys/config.js
