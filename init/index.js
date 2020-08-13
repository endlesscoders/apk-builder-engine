/*eslint-disable unknown-require */
let
    Q = require('q'),
    G = require('../globals'),
    Winston = require('winston'),
    PATH    = require('path');


class LIB {
    constructor(CONFIG) {
        this.CONFIG = CONFIG;
    }

    init(callback) {

        Q(undefined)
            .then(() => {
                return this._initializeLogger();
            })
            .then(() => {
                return callback();
            })
            .fail((error) => {
                console.error('[setup] Error while initializing libraries');
                return callback(error);
            })
            .done();
    }
    
    _initializeLogger() {
        const errorStackTracerFormat = Winston.format(info => {
            if (info.meta && info.meta instanceof Error) {
                info.message = `${info.message} ${info.meta.stack}`;
            }
            return info;
        });

        let logger = Winston.createLogger({
            level: 'info',
            format: Winston.format.combine(Winston.format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                Winston.format.splat(), // Necessary to produce the 'meta' attribute
                errorStackTracerFormat(),
                Winston.format.simple()
            ),
            transports: [
                new Winston.transports.File({filename: PATH.join(__dirname, '../log/error.log'), level: 'error'}),
                new Winston.transports.File({filename: PATH.join(__dirname, '../log/combined.log')}),
                new Winston.transports.Console()
            ]
        });


        if (logger)
            G.Logger = logger;

        try{
            G.Logger.info("Logger Successfully Initiated ..");
        }catch(e){
            G.Logger = console;
            G.Logger.error("Failure In Initializing Logger..");
        }

        return;
    }
}

module.exports = LIB;
