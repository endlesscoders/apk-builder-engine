let G = require('../../globals');
let _ = require('lodash');

let general = function (endpoint, webServer) {
    let app = webServer.app;

    app.get(endpoint + '/status', function (req, res) {
        return res.status(200).json("ok");
    });
};

module.exports = general;