
const config = require('../config')
const Connectdb = config.dbSettings.pool;
const moment = require('moment')
const gaia = require('../services/Gaia.js')
const ServiceLavender = require('../services/index.js')
const _ = require('lodash');

exports.ClearAlarm = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const pump_id = req.body.pump_id;
  const alarm_id = req.body.alarm_id;
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

  if (!alarm_id || !pump_id) {
    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("ClearAlarm_",JSON.stringify(Log_Structure))

    res.send(400,message_response)
    return;
      }
      try{
        if(alarm_id < 1 || alarm_id > 16)
        {
          let message_response = { "message": "Incorrect Parameter or Parameter format." }
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 400,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("ClearAlarm_",JSON.stringify(Log_Structure))
      
          res.send(400,message_response)
          return;
        }
        let resultQuery = await Connectdb.query(`select * from lavender.pumps_real_time where pump_id = ${pump_id}`)
        if(resultQuery.rowCount > 0){
          try{ 
              let resultResponse = await Connectdb.query(`UPDATE lavender.pumps_real_time SET alarm_id= ${Number(0)}, alarm = '[]'::jsonb WHERE pump_id = ${pump_id}`)
                if (resultResponse.rowCount === 1) {
                  let message_response = {"message" : "Clear Alarm " + alarm_id + " on Pump ID : " + pump_id + " is successful."}
                  Log_Structure.response_data = message_response;
                  Log_Structure.response_StatusCode = 200,
                  Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                  ServiceLavender.ServiceLog.WriteLog("ClearAlarm_",JSON.stringify(Log_Structure))
                  res.send(200,message_response)
                  return;

                }
                else {
                  let message_response = {"message" : "Can not Clear Alarm " + alarm_id + " on Pump ID : " + pump_id + "."}
                  Log_Structure.response_data = message_response;
                  Log_Structure.response_StatusCode = 211,
                  Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                  ServiceLavender.ServiceLog.WriteLog("ClearAlarm_",JSON.stringify(Log_Structure))
                  res.send(211,message_response)
                  return;
                }  
            }
          catch(err){
            Log_Structure.response_data = { "message":err.messaeg};
            Log_Structure.response_StatusCode = 500,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.api_error=true
            ServiceLavender.ServiceLog.WriteLog("ClearAlarm_",JSON.stringify(Log_Structure))    
            res.send(500, { "message": err.message})
            return;
          }
        }
        else {
          let message_response = {"message" : "Result not found."}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 212,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          Log_Structure.api_error=false
          ServiceLavender.ServiceLog.WriteLog("ClearAlarm_",JSON.stringify(Log_Structure))  
          res.send(212, message_response)
          return;
        }
      }
      catch(err){
        Log_Structure.response_data = { "message":err.messaeg};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("ClearAlarm_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      } 
}

exports.HealthCheck = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const terminal_id_body = req.body.terminal_id;
  const datetime = req.body.datetime;
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

  if (!terminal_id_body || !datetime) {
      let message_response = { "message": "Incorrect Parameter or Parameter format." }
      Log_Structure.response_data = message_response;
      Log_Structure.response_StatusCode = 400,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      ServiceLavender.ServiceLog.WriteLog("HealthCheck_",JSON.stringify(Log_Structure))

      res.send(400,message_response)
      return;
      }

      try{
        let checkterminal = await Connectdb.query(`SELECT * FROM lavender.health_check WHERE terminal_id = ${terminal_id_body}`)
        if(checkterminal.rowCount !== 0){
          let resultUpdate = await Connectdb.query(`UPDATE lavender.health_check SET created_date = now() WHERE terminal_id = ${terminal_id_body}`)
            if (resultUpdate.rowCount !== 0) {

              var timeIn = new Date(datetime);
              var timeOut = new Date(moment().format('YYYY-MM-DD HH:mm:ss'));
              var diffTime = Math.abs((timeOut.getTime() - timeIn.getTime()) / 1000)
              var errMessage="";
              //console.log("timeIn"+timeIn);
              if(diffTime > 10 && terminal_id_body == 98){
                var date = datetime.substring(0, 10);
                var time = datetime.substring(11);
                const { exec } = require('child_process');
                exec('su -', (error, stdout, stderr)=> {if(error){errMessage=error.message;console.log(error.message);return;}if(stderr){console.log(stderr);return;}})
                //exec('ata123456', (error, stdout, stderr)=> {if(error){console.log(error.message);return;}if(stderr){console.log(stderr);return;}})
                exec(`timedatectl set-time '${req.body.datetime}'`, (error, stdout, stderr)=> {if(error){errMessage=error.message;console.log(error.message);return;}if(stderr){console.log(stderr);return;}})
                //exec('date +%T -s "' + time + '"', (error, stdout, stderr)=> {if(error){errMessage=error.message;console.log(error.message);return;}if(stderr){console.log(stderr);return;}})
          
                await new Promise(resolve => setTimeout(resolve, 100));
                let meassage_set_datetime =""
                if(errMessage==""){
                  meassage_set_datetime = "Update Date Time by terminal id : " + terminal_id_body + " is successful, datetime : "+moment().format('YYYY-MM-DD HH:mm:ss')
                }
                else{
                  meassage_set_datetime = "Update Date Time by terminal id : " + terminal_id_body + " is fail with meassage : "+errMessage
                }

                let message_response = {"message" : "Update Health Check by terminal id : " + terminal_id_body + " is successful."+" And " + meassage_set_datetime}
                Log_Structure.response_data = message_response;
                Log_Structure.response_StatusCode = 200,
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                ServiceLavender.ServiceLog.WriteLog("HealthCheck_",JSON.stringify(Log_Structure))
                res.send(200,message_response)
                return;
              }
              else{
                let message_response = {"message" : "Update Health Check by terminal id : " + terminal_id_body + " is successful."}
                Log_Structure.response_data = message_response;
                Log_Structure.response_StatusCode = 200,
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                ServiceLavender.ServiceLog.WriteLog("HealthCheck_",JSON.stringify(Log_Structure))
                res.send(200,message_response)
                return;
              }          
            }      
            else {
              let message_response = {"message" : "Can not Update Health Check by terminal id : " + terminal_id_body + "."}
              Log_Structure.response_data = message_response;
              Log_Structure.response_StatusCode = 211,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              ServiceLavender.ServiceLog.WriteLog("HealthCheck_",JSON.stringify(Log_Structure))
              res.send(211,message_response)
              return;
            }
        }
        else{
          let resultQuery = await Connectdb.query(`insert into lavender.health_check (terminal_id,created_date) values (${terminal_id_body},now())`)
            if (resultQuery.rowCount !== 0) {

              var timeIn = new Date(datetime);
              var timeOut = new Date(moment().format('YYYY-MM-DD HH:mm:ss'));
              var diffTime = Math.abs((timeOut.getTime() - timeIn.getTime()) / 1000)
              var errMessage="";
              if(diffTime > 10 && terminal_id_body == 98){
                var date = datetime.substring(0, 10);
                var time = datetime.substring(11);
                const { exec } = require('child_process');
                exec('su -', (error, stdout, stderr)=> {if(error){errMessage=error.message;console.log(error.message);return;}if(stderr){console.log(stderr);return;}})
                //exec('ata123456', (error, stdout, stderr)=> {if(error){console.log(error.message);return;}if(stderr){console.log(stderr);return;}})
                exec(`timedatectl set-time '${req.body.datetime}'`, (error, stdout, stderr)=> {if(error){errMessage=error.message;console.log(error.message);return;}if(stderr){console.log(stderr);return;}})
                //exec('date +%T -s "' + time + '"', (error, stdout, stderr)=> {if(error){errMessage=error.message;console.log(error.message);return;}if(stderr){console.log(stderr);return;}})
              
            
                await new Promise(resolve => setTimeout(resolve, 100));

                let meassage_set_datetime =""
                if(errMessage==""){
                  meassage_set_datetime = "Update Date Time by terminal id : " + terminal_id_body + " is successful, datetime : "+moment().format('YYYY-MM-DD HH:mm:ss')
                }
                else{
                  meassage_set_datetime = "Update Date Time by terminal id : " + terminal_id_body + " is fail with meassage : "+errMessage
                }

                let message_response = {"message" : "Update Health Check by terminal id : " + terminal_id_body + " is successful." + " And " + meassage_set_datetime}
                Log_Structure.response_data = message_response;
                Log_Structure.response_StatusCode = 200,
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                ServiceLavender.ServiceLog.WriteLog("HealthCheck_",JSON.stringify(Log_Structure))
                res.send(200,message_response)
                return;
              }
              else{
                let message_response = {"message" : "Update Health Check by terminal id : " + terminal_id_body + " is successful."}
                Log_Structure.response_data = message_response;
                Log_Structure.response_StatusCode = 200,
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                ServiceLavender.ServiceLog.WriteLog("HealthCheck_",JSON.stringify(Log_Structure))
                res.send(200,message_response)
                return;
              }          
            }      
            else {
              let message_response = {"message" : "Can not Update Health Check by terminal id : " + terminal_id_body + "."}
              Log_Structure.response_data = message_response;
              Log_Structure.response_StatusCode = 211,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              ServiceLavender.ServiceLog.WriteLog("HealthCheck_",JSON.stringify(Log_Structure))
              res.send(211,message_response)
              return;
            }
        }
      }
      catch(err){
        Log_Structure.response_data = { "message":err.messaeg};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("HealthCheck_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      } 
    
}

exports.SetPosStatus = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const terminal_id_body = req.body.terminal_id;
  const status = req.body.status;
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

  if (!terminal_id_body || !status) {
    let message_response = {"message" : "Incorrect Parameter or Parameter format."}
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("SetPosStatus_",JSON.stringify(Log_Structure))
    res.send(400,message_response)
    return;
    }
      try{
        let resultQuery = await Connectdb.query(`insert into lavender.pos_status (terminal_id,status,created_date) values (${terminal_id_body},${status} ,now())`)
          if (resultQuery.rowCount !== 0) {
            let message_response = {"message" : "Update Pos Status " + (Number(status) === 1 ? "Open" : "Close") + " by terminal id : " + terminal_id_body + " is successful."}
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 200,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("SetPosStatus_",JSON.stringify(Log_Structure))
            res.send(200,message_response)
            gaia.socketProcess("SetPosStatus",Log_Structure);
            return;
          }
          else {
            let message_response = {"message" : "Can not Update Pos Status " + (Number(status) === 1 ? "Open" : "Close") + " by terminal id : " + terminal_id_body + "."}
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 211,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("SetPosStatus_",JSON.stringify(Log_Structure))
            res.send(211,message_response)
            return;
          }
      }
      catch(err){
        Log_Structure.response_data = { "message":err.messaeg};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("SetPosStatus_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      } 
    
}

exports.SetPosShift = async function (req, res, next) {

  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const terminal_id_body = req.body.terminal_id;
  const status = req.body.status;
  const datetime = req.body.datetime
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

  if (!terminal_id_body || !status || !datetime) {
    let message_response = {"message" : "Incorrect Parameter or Parameter format."}
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("SetPosShift_",JSON.stringify(Log_Structure))

    res.send(400,message_response)
    return;
    }

    try{
      let resultQuery = await Connectdb.query("insert into lavender.pos_shift (terminal_id,status,pos_date,created_date) values (" + terminal_id_body + "," + status + ",'" + datetime + "',now())")

      if(status === '1'){
        var date = datetime.substring(0, 10);
        var time = datetime.substring(11);
        const { exec } = require('child_process');
        exec('su -', (error, stdout, stderr)=> {if(error){console.log(error.message);return;}if(stderr){console.log(stderr);return;}})
        //exec('ata123456', (error, stdout, stderr)=> {if(error){console.log(error.message);return;}if(stderr){console.log(stderr);return;}})
        exec(`timedatectl set-time '${req.body.datetime}'`, (error, stdout, stderr)=> {if(error){console.log(error.message);return;}if(stderr){console.log(stderr);return;}})
        //exec('date +%T -s "' + time + '"', (error, stdout, stderr)=> {if(error){console.log(error.message);return;}if(stderr){console.log(stderr);return;}})
        ServiceLavender.ServiceBackUp.BackupData([{tableName:"transactions_bk",condition:"SetPosShift"}])
      }
      
      await new Promise(resolve => setTimeout(resolve, 100));
        if (resultQuery.rowCount !== 0) {
          let message_response = { "message" : "Update Pos Shift " + " by terminal id : " + terminal_id_body + " is successful.", "datetime" : moment().format('YYYY-MM-DD HH:mm:ss') }
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 200,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("SetPosShift_",JSON.stringify(Log_Structure))
          res.send(200,message_response)
          gaia.socketProcess("SetPosShift",Log_Structure);
          return;
        }
        else {
          let message_response = { "message" : "Can not Update Pos Shift " + " by terminal id : " + terminal_id_body + "."}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 211,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("SetPosShift_",JSON.stringify(Log_Structure))
          res.send(211,message_response)
          return;
        }
    }
    catch(err){
      Log_Structure.response_data = {"message":err.messaeg};
      Log_Structure.response_StatusCode = 500,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      Log_Structure.api_error=true
      ServiceLavender.ServiceLog.WriteLog("SetPosShift_",JSON.stringify(Log_Structure))    
      res.send(500, { "message": err.message})
      return;
    } 
  
}



async function check_alarm(alarm_db, alarm_update){

  let alarm_db_String = Number(alarm_db).toString(2).padStart(16, "0");
  for (let i = 0; i < alarm_db_String.length; i++) {
      if((16 - alarm_update) === i && alarm_db_String[i] === '0')
        return true;
  }
  return false;
}

async function map_alarm(alarm_id, alarm_description){
  var alarmList = [];
  if(Number(alarm_id) === 0) return JSON.stringify(alarm_description);
  else{
    for(let i=0; i < alarm_description.length; i++){
      if(alarm_description[i].alarm_id == alarm_id){
        alarm_description.splice(i,1);
      }
    }
    return JSON.stringify(alarm_description);
  }
}

