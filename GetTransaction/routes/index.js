
const Transaction = require('../controllers/Transaction.js');
const { Authentication } = require('../untils')

module.exports = (server) => {
    server.post('/Lavender/TransactionByPumpID',Authentication.isAuthen, Transaction.TransactionByPumpID);
    server.post('/Lavender/TransactionByHoseID',Authentication.isAuthen, Transaction.TransactionByHoseID);
    server.post('/Lavender/TransactionSpecificDate',Authentication.isAuthen, Transaction.TransactionSpecificDate);
    server.get('/Lavender/CurrentTransaction/:pump_id',Authentication.isAuthen, Transaction.CurrentTransaction);
    server.get('/Lavender/StackTransaction/:pump_id',Authentication.isAuthen, Transaction.StackTransaction);
    server.get('/Lavender/OfflineTransaction/:pump_id',Authentication.isAuthen, Transaction.OfflineTransaction);
    server.get('/Lavender/AllOfflineTransaction',Authentication.isAuthen, Transaction.AllOfflineTransaction);
    server.post('/Lavender/PushStack',Authentication.isAuthen, Transaction.PushStack);
    server.post('/Lavender/LockTransaction',Authentication.isAuthen, Transaction.LockTransaction);
    server.post('/Lavender/ReleaseTransaction',Authentication.isAuthen, Transaction.ReleaseTransaction);
    server.post('/Lavender/ReleaseAllTransaction',Authentication.isAuthen, Transaction.ReleaseAllTransaction);
    server.post('/Lavender/ClearPostPayTransaction',Authentication.isAuthen, Transaction.ClearPostPayTransaction);
    server.post('/Lavender/ClearAllPostPayTransaction',Authentication.isAuthen, Transaction.ClearAllPostPayTransaction)
    server.post('/Lavender/ClearTestTransaction',Authentication.isAuthen, Transaction.ClearTestTransaction);
    server.post('/Lavender/ClearAllTestTransaction',Authentication.isAuthen, Transaction.ClearAllTestTransaction)
}
