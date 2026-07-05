const config = require('../config')
const Connectdb = config.dbSettings.pool;
const moment = require('moment')
const ServiceLavender = require('../services/index.js')
const _ = require('lodash');

exports.GetPumps = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
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

  try{
    let resultQuery = await Connectdb.query(`SELECT pump_id, loop_id, pump_channel_id, pump_name, stack_limit, pump_display_id FROM lavender.pumps order by pump_id`)   
        if(resultQuery.rowCount > 0){
          try{
            let resultResponse =  await Promise.all(resultQuery.rows.map(async(data,i)=>{
              let resultDisplay = await Connectdb.query(`SELECT * FROM lavender.pumps_display WHERE display_id = ${data.pump_display_id}`)
              let resultHoses = await Connectdb.query(`SELECT hose_id FROM lavender.hoses WHERE pump_id = ${data.pump_id} order by hose_id`)
              let resultStatus = await Connectdb.query(`SELECT volume, value, status FROM lavender.pumps_real_time where pump_id = ${data.pump_id}`)
              if(resultHoses.rowCount > 0 && resultDisplay.rowCount === 1 && resultStatus.rowCount === 1){
                data.hoses = resultHoses.rows;
                data.volume_digit = resultDisplay.rows[0].volume_decimal_digit;
                data.value_digit = resultDisplay.rows[0].value_decimal_digit;
                data.price_digit = resultDisplay.rows[0].price_decimal_digit;
                data.total_volume_digit = resultDisplay.rows[0].volume_total_decimal_digit;
                data.total_value_digit = resultDisplay.rows[0].value_total_decimal_digit;
                data.volume = resultStatus.rows[0].volume;
                data.value = resultStatus.rows[0].value;
                data.status = resultStatus.rows[0].status;
                return Promise.resolve(data);
              }
              else{
                let message_response =  {"message" : "Incorrect Parameter."}
                Log_Structure.response_data = message_response;
                Log_Structure.response_StatusCode = 400,
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                Log_Structure.api_error=false
                ServiceLavender.ServiceLog.WriteLog("GetPumps_",JSON.stringify(Log_Structure))  
                res.send(400, message_response)
                return;
              }
            }))
            let message_response = { "message": "Response Data QTY : "+resultResponse.length+ " record" }
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 200,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("GetPumps_",JSON.stringify(Log_Structure))
            res.send(200,resultResponse)
            return;
          }
          catch(error){
            Log_Structure.response_data = { "message":error.messaeg};
            Log_Structure.response_StatusCode = 500,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.api_error=true
            ServiceLavender.ServiceLog.WriteLog("GetPumps_",JSON.stringify(Log_Structure))    
            res.send(500, { "message": error.message})
            return;
          }
        }
        else{
          let message_response = {"message" : "Result not found."}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 212,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          Log_Structure.api_error=false
          ServiceLavender.ServiceLog.WriteLog("GetPumps_",JSON.stringify(Log_Structure))  
          res.send(212, message_response)
          return;
		}
      }
      catch (err) {
        Log_Structure.response_data = { "message":err.messaeg};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("GetPumps_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      }
  

}
exports.GetHoses = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
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

  try{
        let resultQuery = await Connectdb.query("SELECT h.pump_id, h.hose_id, h.hose_number, h.grade_id, g.grade_name, h.price_profile_id, p.price_level_1, h.tank_id"
                                              + " from lavender.hoses as h"
                                              + " INNER join lavender.grades as g on h.grade_id = g.grade_id"
                                              + " INNER join lavender.price_profiles as p on h.price_profile_id = p.profile_id"
                                              + " order by h.pump_id, h.hose_id")   
        
        if(resultQuery.rowCount !== 0){
          let message_response = { "message": "Response Data QTY : "+resultQuery.rows.length+ " record" }
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 200,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("GetHoses_",JSON.stringify(Log_Structure))
          res.send(200,resultQuery.rows)
        }
        else{
          let message_response = {"message" : "Result not found."}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 212,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          Log_Structure.api_error=false
          ServiceLavender.ServiceLog.WriteLog("GetHoses_",JSON.stringify(Log_Structure))  
          res.send(212, message_response)
          return;
		}
      }
      catch(err){
        Log_Structure.response_data = { "message":err.messaeg};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("GetHoses_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      }

}
exports.GetHosesbyPump = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const pump_id = req.params.pump_id
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

  if(!pump_id){
    let message_response =  {"message" : "Incorrect Parameter."}
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    Log_Structure.api_error=false
    ServiceLavender.ServiceLog.WriteLog("GetHosesbyPump_",JSON.stringify(Log_Structure))  
    res.send(400, message_response)
    return;
    }
    try{
        let resultQuery = await Connectdb.query("SELECT h.pump_id, h.hose_id, h.hose_number, h.grade_id, g.grade_name, h.price_profile_id, p.price_level_1, h.tank_id"
                                              + " from lavender.hoses as h"
                                              + " INNER join lavender.grades as g on h.grade_id = g.grade_id"
                                              + " INNER join lavender.price_profiles as p on h.price_profile_id = p.profile_id"
                                              + " WHERE h.pump_id = " + pump_id + ""
                                              + " order by h.pump_id, h.hose_id")   
        
        if(resultQuery.rowCount !== 0){
          let message_response = { "message": "Response Data QTY : "+resultQuery.rows.length+ " record" }
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 200,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("GetHosesbyPump_",JSON.stringify(Log_Structure))
          res.send(200,resultQuery.rows)
        }
        else{
          let message_response = {"message" : "Result not found."}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 212,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          Log_Structure.api_error=false
          ServiceLavender.ServiceLog.WriteLog("GetHosesbyPump_",JSON.stringify(Log_Structure))  
          res.send(212, message_response)
          return;
		}
      }
      catch(err){
        Log_Structure.response_data = { "message":err.messaeg};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("GetHosesbyPump_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      }
  
}

