const Pool = require('pg').Pool
module.exports = {
    name: 'Lavender API : Realtime Group',
    version: '1.0.0',
    env: process.env.NODE_ENV || 'production',
    serverSettings: {
        port: process.env.PORT || 3001
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
    log_path:"/lavender/log/api/GetRealtimeValue",
    //log_path: __dirname
   
}
