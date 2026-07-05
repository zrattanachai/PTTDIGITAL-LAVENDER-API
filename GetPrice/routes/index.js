const Price = require('../controllers/Price.js');
const { Authentication } = require('../untils')

module.exports = (server) => {
    server.get('/Lavender/GetPriceByPump/:pumpid/:hosenumber',Authentication.isAuthen, Price.GetPriceByPump);
    server.post('/Lavender/SetPrice',Authentication.isAuthen, Price.SetPrice);
}