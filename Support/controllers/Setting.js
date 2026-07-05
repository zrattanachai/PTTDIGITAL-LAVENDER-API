const config = require('../config')
//const Connectdb = config.dbSettings.pool;
const moment = require('moment')
const ServiceLavender = require('../services/index.js')
const _ = require('lodash');
const Pool = require('pg').Pool

exports.SetZeroSupport = async function (req, res, next){
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const transaction_id = req.body.transaction_id
  const ip_local = req.body.ip_local
  const portDB = req.body.port
  const userDB = req.body.user
  const passwordDB = req.body.password

  let Log_Structure = {
    time_request:moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
    ip_request: ip_request,
    terminal_id: terminal_id,
    request_body : req.body,
    request_params : req.params,
    response_StatusCode:"",
    response_data : "",
    time_response:"",
    api_error:false 
  }  
  
  if (!transaction_id || !ip_local || !portDB || !userDB || !passwordDB) {
    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("SetZeroSupport_",JSON.stringify(Log_Structure))

    res.send(400,message_response)
    return
    }

    try{

      

      const Connectdb = new Pool({
        user: userDB,
        host: ip_local,
        database: 'LAVENDERDB',
        password: passwordDB,
        port: Number(portDB),
      })


        //SetZeroTransaction     
        await Connectdb.query(`TRUNCATE TABLE lavender.transactions RESTART IDENTITY`)
        await Connectdb.query(`ALTER SEQUENCE lavender.transactions_transaction_id_seq RESTART WITH ${transaction_id}`)
        await Connectdb.query(`TRUNCATE TABLE lavender.transactions_bk RESTART IDENTITY`)

        //SetZeroPump
        await Connectdb.query(`TRUNCATE TABLE lavender.pumps RESTART IDENTITY`)

        //SetZeroDisplay
        await Connectdb.query(`TRUNCATE TABLE lavender.pumps_display RESTART IDENTITY`)

        //SetZeroAdvance
        await Connectdb.query(`TRUNCATE TABLE lavender.advances_setting RESTART IDENTITY`)

        //SetZeroRealtime
        await Connectdb.query(`TRUNCATE TABLE lavender.pumps_real_time RESTART IDENTITY`)

        //SetZeroHose
        await Connectdb.query(`TRUNCATE TABLE lavender.hoses RESTART IDENTITY`)

        //SetZeroPumpLog
        await Connectdb.query(`TRUNCATE TABLE lavender.pump_logs RESTART IDENTITY`)

        //SetZeroPumpCommand
        await Connectdb.query(`TRUNCATE TABLE lavender.pump_commands RESTART IDENTITY`)
        await Connectdb.query(`TRUNCATE TABLE lavender.commands_bk RESTART IDENTITY`)

        //SetZeroTank
        await Connectdb.query(`TRUNCATE TABLE lavender.tanks RESTART IDENTITY`)

        //SetZeroTankDelivery  
        await Connectdb.query(`TRUNCATE TABLE lavender.tanks_delivery RESTART IDENTITY`)

        //SetZeroTankAlarmHistory
        await Connectdb.query(`TRUNCATE TABLE lavender.tanks_alarm_history RESTART IDENTITY`)

        //SetZeroTankLog
        await Connectdb.query(`TRUNCATE TABLE lavender.tank_gauge_logs RESTART IDENTITY`)

        //SetZeroLoop
        await Connectdb.query(`TRUNCATE TABLE lavender.loops RESTART IDENTITY`)

        //SetZeroGrade
        await Connectdb.query(`TRUNCATE TABLE lavender.grades RESTART IDENTITY`)

        //SetZeroTank
        await Connectdb.query(`TRUNCATE TABLE lavender.tanks RESTART IDENTITY`)

        //SetZeroPriceProfile
        await Connectdb.query(`TRUNCATE TABLE lavender.price_profiles RESTART IDENTITY`)

        //SetZeroSiteConfig
        //await Connectdb.query(`TRUNCATE TABLE lavender.site_config RESTART IDENTITY`)

        //SetZeroConfigFleetFraud
        try{
          await Connectdb.query(`TRUNCATE TABLE lavender.config_fleet_fraud RESTART IDENTITY`)
        }catch{
          await Connectdb.query(`CREATE TABLE lavender.config_fleet_fraud
          (
              pump_id integer NOT NULL,
              counting integer NOT NULL,
              time_waiting integer NOT NULL,
              duration integer NOT NULL,
              update_time timestamp without time zone NOT NULL,
              PRIMARY KEY (pump_id)
          );
          
          ALTER TABLE IF EXISTS lavender.config_fleet_fraud
              OWNER to postgres;
          
          GRANT DELETE, UPDATE, SELECT, INSERT ON TABLE lavender.config_fleet_fraud TO lav_application_role`)
        }
        
          let message_response = { "message":"SetZeroSupport start transaction_id : " + transaction_id + " is successful."}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 200,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("SetZeroSupport_",JSON.stringify(Log_Structure))   
          res.send(200,{"message":"SetZeroSupport start transaction_id : " + transaction_id + " is successful."})
          return   
    }
    catch(err){
      Log_Structure.response_data = { "message": err.message};
      Log_Structure.response_StatusCode = 500,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      Log_Structure.api_error=true
      ServiceLavender.ServiceLog.WriteLog("SetZeroSupport_",JSON.stringify(Log_Structure))    
      res.send(500, { "message": err.message.replace(/\"/g,'')})
      return
    } 
}