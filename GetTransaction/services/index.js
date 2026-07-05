//const userService = require('./user.service')
const ServiceLog = require('./Log_Management.js')
const ServiceBackUp = require('./BackUp_Data.js')

module.exports = Object.assign({ServiceBackUp}, { ServiceLog })
