const Pos = require('../controllers/Pos.js');
const { Authentication } = require('../untils')

module.exports = (server) => {
    server.post('/Lavender/ClearAlarm',Authentication.isAuthen, Pos.ClearAlarm);
    server.post('/Lavender/HealthCheck',Authentication.isAuthen,Pos.HealthCheck);
    server.post('/Lavender/SetPosStatus',Authentication.isAuthen,Pos.SetPosStatus);
    server.post('/Lavender/SetPosShift',Authentication.isAuthen,Pos.SetPosShift);
} 