let
    general = require('./general');

class Router {
    constructor(webServer) {
        this.webServer = webServer;
    }

    initRoutes() {

        general('/api/general', this.webServer);
        
    }
}

module.exports = Router;
