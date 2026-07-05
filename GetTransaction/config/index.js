const Pool = require('pg').Pool
module.exports = {
    name: 'Lavender API : Transaction Group',
    version: '1.0.0',
    env: 'production',
    serverSettings: {
        port: 3004
    },
    dbSettings: {
         pool : new Pool({
            user: 'lav_api_app',
            host: 'localhost',
            database: 'LAVENDERDB',
            password: 'GCb7JA+W6Hg?4=Vf',
            port: 5432,
          })
    }, 
    log_path:"/lavender/log/api/GetTransaction"
    //log_path: __dirname
}
