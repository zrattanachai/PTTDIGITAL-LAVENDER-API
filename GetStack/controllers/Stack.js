const config = require('../config')
const Connectdb = config.dbSettings.pool;
const moment = require('moment')
const ServiceLavender = require('../services/index.js')
const _ = require('lodash');

exports.GetStackByPump = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const pump_id = req.params.pumpid;
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


  if (!pump_id) {
    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("GetStackByPump_",JSON.stringify(Log_Structure))

    res.send(400,message_response)
    return;
    }
    try {
        let resultQuery = await Connectdb.query(`SELECT pump_id,stack_limit FROM lavender.pumps WHERE pump_id = ${pump_id}`)
        if (resultQuery.rowCount > 0) {
          try {
            let resultResponse = await Promise.all(resultQuery.rows.map(async (data, i) => {
              data.completed_ts = moment(data.completed_ts).local().format("D/MM/YYYY HH:mm:ss");
              data.cleared_date_time = moment(data.cleared_date_time).local().format("D/MM/YYYY HH:mm:ss");
              return Promise.resolve(data);
            }))
            let message_response = { "message": "Response Data QTY : "+resultResponse.length+ " record" }
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 200,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("GetStackByPump_",JSON.stringify(Log_Structure))
            res.send(200,resultResponse)
            return;
          }
          catch (err) {
            Log_Structure.response_data = {"message":err.messaeg};
            Log_Structure.response_StatusCode = 500,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.api_error=true
            ServiceLavender.ServiceLog.WriteLog("GetStackByPump_",JSON.stringify(Log_Structure))    
            res.send(500, { "message": err.message})
            return;
          }
        }
        else{
          let message_response = {"message" : "Result not found."}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 212,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          Log_Structure.api_error=false
          ServiceLavender.ServiceLog.WriteLog("GetStackByPump_",JSON.stringify(Log_Structure))  
          res.send(212, message_response)
          return;
		}
      }
      catch (err) {
        Log_Structure.response_data = {"message":err.messaeg};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("GetStackByPump_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      }
    
}

exports.SetStackByPump = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const pump_id = req.body.pump_id;
  const stack = req.body.stack;
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

    if (!pump_id || !stack || stack < 1) {
      let message_response = { "message": "Incorrect Parameter or Parameter format." }
      Log_Structure.response_data = message_response;
      Log_Structure.response_StatusCode = 400,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      ServiceLavender.ServiceLog.WriteLog("SetStackByPump_",JSON.stringify(Log_Structure))
  
      res.send(400,message_response)
      return;
      }
      try {
        let resultResponse = await Connectdb.query(`UPDATE lavender.pumps SET stack_limit= ${stack} WHERE pump_id = ${pump_id}`)
        if (resultResponse.rowCount === 1){
          let message_response = { "message":"Update Stack by Pump ID : " + pump_id + " is success, please restart Lavender-dispenser.service"}
		  
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 200,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("SetStackByPump_",JSON.stringify(Log_Structure))
          ServiceLavender.ServiceBackUp.BackupData([{tableName : "pumps",pump_id : pump_id}])
          res.send(200,message_response)
          return;
        }else{
          let message_response = { "message":"Can not Update Stack by Pump ID : " + pump_id }
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 211,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("SetStackByPump_",JSON.stringify(Log_Structure))
          res.send(211,message_response)
          return;
		}
      }
      catch (err) {
        Log_Structure.response_data = {"message":err.messaeg};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("SetStackByPump_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      }
    
}
