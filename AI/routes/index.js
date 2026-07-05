const AI = require('../controllers/AI.js');
const { Authentication } = require('../untils')

module.exports = (server) => {
    server.post('/Lavender/AI/Login',AI.Login);
    server.post('/Lavender/AI/ServiceManagement',Authentication.isAuthen,AI.ServiceManagement);
    server.post('/Lavender/AI/ClearAlarm',Authentication.isAuthen,AI.ClearAlarm);
    server.post('/Lavender/AI/RollbackTransaction',Authentication.isAuthen,AI.RollbackTransaction);
    server.post('/Lavender/AI/SetStackByPump',Authentication.isAuthen,AI.SetStackByPump);
    server.get('/Lavender/AI/GetPumpRealtime',Authentication.isAuthen,AI.GetPumpRealtime);
    server.get('/Lavender/AI/GetCommands_bk',Authentication.isAuthen,AI.GetCommands_bk);

    server.get('/Lavender/AI/GetTransactions',Authentication.isAuthen,AI.GetTransactions);
    server.get('/Lavender/AI/GetTransactions_bk',Authentication.isAuthen,AI.GetTransactions_bk);
    server.get('/Lavender/AI/GetTanks',Authentication.isAuthen,AI.GetTanks);
    server.get('/Lavender/AI/GetHoses',Authentication.isAuthen,AI.GetHoses);
    server.get('/Lavender/AI/GetPumpLogs',Authentication.isAuthen,AI.GetPumpLogs);
}
