
const LavenderSetting = require('../controllers/LavenderSetting.js');
const { Authentication } = require('../untils')

module.exports = (server) => {
    server.get('/Lavender/GetSerialDescription',Authentication.isAuthen,LavenderSetting.GetSerialDescription);
    server.post('/Lavender/SetSerialDescription',Authentication.isAuthen,LavenderSetting.SetSerialDescription);
    server.post('/Lavender/GetConfigFan',Authentication.isAuthen,LavenderSetting.GetConfigFan);
    server.post('/Lavender/SetConfigFan',Authentication.isAuthen,LavenderSetting.SetConfigFan);
    server.post('/Lavender/GetConfigModem',Authentication.isAuthen,LavenderSetting.GetConfigModem);
    server.post('/Lavender/SetConfigModem',Authentication.isAuthen,LavenderSetting.SetConfigModem);
} 
