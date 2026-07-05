
const Setting = require('../controllers/Setting.js');
const { Authentication } = require('../untils')

module.exports = (server) => {
    server.post('/Lavender/SetZero',Authentication.isAuthen,Setting.SetZero);
    server.post('/Lavender/SetZeroTransaction',Authentication.isAuthen,Setting.SetZeroTransaction);
    server.post('/Lavender/ResetTransaction',Authentication.isAuthen,Setting.ResetTransaction);
    server.get('/Lavender/Processing',Authentication.isAuthen,Setting.Processing);
    server.post('/Lavender/set-config-fleet-fraud',Authentication.isAuthen,Setting.SetConfigFleetFraud);
    server.get('/Lavender/get-config-fleet-fraud',Authentication.isAuthen,Setting.GetConfigFleetFraud);
    server.post('/Lavender/delete-config-fleet-fraud',Authentication.isAuthen,Setting.DeleteConfigFleetFraud);
}
