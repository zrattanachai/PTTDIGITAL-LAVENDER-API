
const ManageAPI = require('../controllers/ManageAPI.js');
const { Authentication } = require('../untils')

module.exports = (server) => {
    server.get('/Lavender/GetStatusPM2',Authentication.isAuthen,ManageAPI.GetStatusPM2);
    server.post('/Lavender/StartStopPM2',Authentication.isAuthen,ManageAPI.StartStopPM2);

} 