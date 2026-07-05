const config = require('../config')
const Realtime = require('../controllers/Value.Realtime.js');
const { Authentication } = require('../untils')

module.exports = (server) => {
    server.get('/Lavender/CurrentValue',Authentication.isAuthen, Realtime.CurrentValue);
    server.get('/Lavender/CurrentValueByPump/:pumpid',Authentication.isAuthen, Realtime.CurrentValueByPump);
    server.get('/Lavender/CurrentStatusByPump/:pumpid',Authentication.isAuthen, Realtime.CurrentStatusByPump);
    server.get('/Lavender/CurrentStatus',Authentication.isAuthen, Realtime.CurrentStatus);
    server.get('/Lavender/CurrentValue-v2',Authentication.isAuthen, Realtime.CurrentValue_v2);
    server.get('/Lavender/CurrentValueByPump-v2/:pumpid',Authentication.isAuthen, Realtime.CurrentValueByPump_v2);
    server.get('/Lavender/CurrentStatusByPump-v2/:pumpid',Authentication.isAuthen, Realtime.CurrentStatusByPump_v2);
    server.get('/Lavender/CurrentStatus-v2',Authentication.isAuthen, Realtime.CurrentStatus_v2);



} 