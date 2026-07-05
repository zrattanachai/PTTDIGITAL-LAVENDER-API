const Tanks = require('../controllers/Tanks.js');
const { Authentication } = require('../untils')

module.exports = (server) => {
    server.get('/Lavender/TankInfo', Authentication.isAuthen, Tanks.TankInfo);
    server.get('/Lavender/TankInfoByTankID/:tankid',Authentication.isAuthen, Tanks.TankInfoByTankID);
    server.get('/Lavender/TankInventory',Authentication.isAuthen, Tanks.TankInventory);
    server.get('/Lavender/TankInventoryByTankID/:tankid',Authentication.isAuthen, Tanks.TankInventoryByTankID);
    server.get('/Lavender/TankAlarm',Authentication.isAuthen, Tanks.TankAlarm);
    server.get('/Lavender/TankAlarmByTankID/:tankid',Authentication.isAuthen, Tanks.TankAlarmByTankID);
    server.post('/Lavender/TankTheoreticalByTank',Authentication.isAuthen,Tanks.TankTheoreticalByTank);
    server.get('/Lavender/TankDelivery',Authentication.isAuthen,Tanks.TankDelivery);
    server.get('/Lavender/TankDeliveryByTankID/:tank_id',Authentication.isAuthen,Tanks.TankDeliveryByTankID);
    server.post('/Lavender/TankSetDipProduct',Authentication.isAuthen, Tanks.TankSetDipProduct);
    server.post('/Lavender/TankSetDensity',Authentication.isAuthen, Tanks.TankSetDensity);
	server.post('/Lavender/ClearTheoreticalVolumeByTank',Authentication.isAuthen, Tanks.ClearTheoreticalVolumeByTank);
}
