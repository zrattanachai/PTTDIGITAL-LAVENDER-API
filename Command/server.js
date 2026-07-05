const restify = require('restify')
const logger = require('morgan')
const corsMiddleware = require('restify-cors-middleware2')
const config = require('./config') 

const server = restify.createServer({
    name: config.name,
    version: config.version
})

const cors = corsMiddleware({
    origins: ['*'],
    allowHeaders: ['Content-Type','Content-Length','Authorization'],
})

server.use(logger('dev'))
server.pre(cors.preflight)
server.use(cors.actual)
server.use(restify.plugins.gzipResponse());
server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.listen(config.serverSettings.port, () => {

    console.log(`---${config.name} Service ---`)
    console.log(`Connecting to ${config.name} repository...`)
    console.log(`Open Service By Port ${config.serverSettings.port} Success`);
    require('./routes')(server)
})

process.on('SIGINT', () => {
    process.exit(0)
})

// Graceful shutdown
process.on('SIGTERM', () => {

    console.log(`Closing ${config.name} Service.`)
    server.close((err) => {
        if (err) {
            console.error(err)
            process.exit(1)
        }

        console.log('Server closed.')

       
    })
})

module.exports = server
