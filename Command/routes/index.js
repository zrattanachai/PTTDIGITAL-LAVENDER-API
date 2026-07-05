const commands = require('../controllers/Commands.js');
const { Authentication } = require('../untils')

module.exports = (server) => {
    server.post('/Lavender/AuthorizeByPump', Authentication.isAuthen,commands.AuthorizeByPump);
    server.post('/Lavender/StopByPump',Authentication.isAuthen, commands.StopByPump);
    server.post('/Lavender/StartByPump',Authentication.isAuthen, commands.StartByPump);
    server.post('/Lavender/AuthorizeAmtPresetByPump',Authentication.isAuthen, commands.AuthorizeAmtPresetByPump);
    server.post('/Lavender/AuthorizeVolPresetByPump',Authentication.isAuthen, commands.AuthorizeVolPresetByPump);
    server.post('/Lavender/CancelAuthorizeByPump',Authentication.isAuthen,commands.CancelAuthorizeByPump)
    server.get('/Lavender/StopPump',Authentication.isAuthen, commands.StopPump);
    server.get('/Lavender/StartPump',Authentication.isAuthen, commands.StartPump);
}