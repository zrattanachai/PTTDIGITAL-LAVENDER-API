
const Stack = require('../controllers/Stack.js');
const { Authentication } = require('../untils')

module.exports = (server) => {
    server.get('/Lavender/GetStackByPump/:pumpid',Authentication.isAuthen, Stack.GetStackByPump);
    server.post('/Lavender/SetStackByPump',Authentication.isAuthen, Stack.SetStackByPump);
}