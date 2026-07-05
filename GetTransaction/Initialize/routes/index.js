const Initials = require('../controllers/Initials.js');
const { Authentication } = require('../untils')

module.exports = (server) => {
    server.get('/Lavender/GetPumps',Authentication.isAuthen, Initials.GetPumps);
    server.get('/Lavender/GetHoses',Authentication.isAuthen,  Initials.GetHoses);
    server.get('/Lavender/GetHosesybyPump/:pump_id',Authentication.isAuthen,  Initials.GetHosesbyPump);
}
