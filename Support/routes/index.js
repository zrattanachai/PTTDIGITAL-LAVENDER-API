
const Setting = require('../controllers/Setting.js');
const { Authentication } = require('../untils')

module.exports = (server) => {
    server.post('/Lavender/SetZeroSupport',Authentication.isAuthen,Setting.SetZeroSupport);
} 