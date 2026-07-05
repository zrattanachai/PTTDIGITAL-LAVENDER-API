const Pool = require('pg').Pool
module.exports = {
    name: 'Lavender API : AI Group',
    version: '3.3.0',
    env: 'production',
    serverSettings: {
        port: 6000
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
    log_path:"/lavender/log/api/AI"
}
