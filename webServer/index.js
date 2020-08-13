let
    HTTP = require('http'),
    PATH = require('path'),

    EXPRESS = require('express'),
    BODY_PARSER = require('body-parser'),
    fs = require('fs'),
    G = require('../globals'),
    morgan = require('morgan'),
    rfs = require('rotating-file-stream');


class WebServer {
    constructor(config, lib, opts) {
        this.config = config;
        this.env = process.env.NODE_ENV || 'development';
        this.app = EXPRESS();
        this.logDirectory = PATH.join(__dirname, '../log');
        this.app.disable('etag');
        this.app.disable('x-powered-by');

        this.app.set('port', this.config.WEBSERVER.PORT);
        this.app.use(BODY_PARSER.json());

        fs.existsSync(this.logDirectory) || fs.mkdirSync(this.logDirectory);
        this.accessLogStream = rfs.createStream('access.log', {
            interval: '1d',
            path: this.logDirectory
        });

        this.app.use(this._setCors.bind(this));
        this.app.use(EXPRESS.static(PATH.join(__dirname, '../public')));
        this.app.use(morgan('combined', {stream : this.accessLogStream}));

    }

    start(callback) {
        let L = G.Logger;

        L.info("WebServer setting routes");
        this._setRoutes();

        L.info("WebServer creating HTTP server");

        HTTP.globalAgent.maxSockets = Infinity;

        HTTP.createServer(this.app)
            .on('error', function (err) {
                L.error(err);
                process.exit(1);
            })
            .listen(this.config.WEBSERVER.PORT, "0.0.0.0", () => {
                L.info("WebServer Listening on localhost on port "+ this.config.WEBSERVER.PORT+" in " + (process.env.NODE_ENV || 'dev'));

                if (callback && typeof callback === 'function') {
                    callback();
                }
            });
    }

    _setCors(req, res, next, self) {
        res.header('Access-Control-Allow-Origin', self.config.COMMON.CORS.hosts);
        res.header('Access-Control-Allow-Methods', self.config.COMMON.CORS.actions);
        next();
    }

    _setRoutes() {
        let ROUTER = require('../routes'),
            routerInstance = new ROUTER(this);

        routerInstance.initRoutes();
    }
}


module.exports = WebServer;
