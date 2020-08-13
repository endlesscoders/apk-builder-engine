let 
    CONFIG = require('./config'),
    WEBSERVER = require('./webServer'),
    INIT = require('./init');

let INIT_INSTANCE = new INIT(CONFIG);
let WS = new WEBSERVER(CONFIG, INIT_INSTANCE, {});

let WEB_SERVICE = (cb) => {
    INIT_INSTANCE.init((error) => {
        if(error) {
            console.log("[INIT_INSTANCE] Error : ", error);
            process.exit(1);
        }
        WS.start((err)=> cb(err))
    });
};


module.exports = WEB_SERVICE;

(function() {
    if(require.main === module) {
        WEB_SERVICE(()=>{});
    }
}());