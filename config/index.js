let constants = require('./constants');


let config = {
    'COMMON': {
        'WEBSERVER': {
            'PORT': 4141
        },
        "CORS" : {
            'hosts' : ['*'].join(),
            'actions' : ['GET','PUT','POST','OPTIONS'].join()
        }
    }
}


let load = () => {
    let loadedConfig = config.COMMON;

    let env = process.env.NODE_ENV || 'development';
    env = env.toLowerCase();

    loadedConfig.ENVIRONMENT = env;

    let envConfig = require('./env/' + env);

    Object.keys(envConfig).forEach( (key) => {
        loadedConfig[key] = envConfig[key];
    });

    loadedConfig.CONSTANTS = constants;
    return loadedConfig;
}

module.exports = load();
