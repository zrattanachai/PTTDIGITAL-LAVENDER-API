const Grade = require('../controllers/Grade.js');
const { Authentication } = require('../untils')

module.exports = (server) => {
    server.get('/Lavender/Grade',Authentication.isAuthen, Grade.Gradeall);
    server.get('/Lavender/GradeByPump/:pumpid/:hosenumber',Authentication.isAuthen, Grade.GradeByPumpID);
    server.post('/Lavender/SetGradeByPump',Authentication.isAuthen, Grade.SetGradeByPump);
    server.post('/Lavender/SetGrade',Authentication.isAuthen, Grade.SetGrade);
    server.post('/Lavender/ChangeGrade',Authentication.isAuthen, Grade.ChangeGrade);
    server.post('/Lavender/ChangeGrade-v2',Authentication.isAuthen, Grade.ChangeGrade_v2);
    server.post('/Lavender/DeleteGrade',Authentication.isAuthen, Grade.DeleteGrade);
}