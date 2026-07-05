const Totalizer = require('../controllers/Totalizer.js');
const { Authentication } = require('../untils')

module.exports = (server) => {
    server.get('/Lavender/Totalizer',Authentication.isAuthen, Totalizer.Totalizer);
    server.get('/Lavender/TotalizerByHose/:hoseid',Authentication.isAuthen, Totalizer.TotalizerByHose);
    server.get('/Lavender/TotalizerByPump/:pumpid/:hosenumber',Authentication.isAuthen, Totalizer.TotalizerByPump);
    server.get('/Lavender/GetTotalizerM/:pumpid/:hosenumber',Authentication.isAuthen, Totalizer.GetTotalizerM);
    server.post('/Lavender/SetTotalizerM',Authentication.isAuthen, Totalizer.SetTotalizerM);

}