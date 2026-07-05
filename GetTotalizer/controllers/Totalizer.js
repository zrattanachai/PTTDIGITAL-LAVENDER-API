const config = require('../config')
const Connectdb = config.dbSettings.pool;
const moment = require('moment')
const ServiceLavender = require('../services/index.js')
const _ = require('lodash');

exports.Totalizer = async function (req, res, next) {
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
    let resultQuery = await Connectdb.query("SELECT hose_id,pump_id,hose_number,total_meter_volume,total_meter_value,total_meter_machanical"+
                                                " FROM lavender.hoses order by hose_id")   
        if(resultQuery.rowCount > 0){
          try{
            let resultResponse =  await Promise.all(resultQuery.rows.map(async(data,i)=>{
                if(data.total_meter_machanical === null) data.total_meter_machanical = Number("0.00");
                else data.total_meter_machanical = Number(data.total_meter_machanical);
                data.total_meter_value = Number(data.total_meter_value);
                data.total_meter_volume = Number(data.total_meter_volume);
                data.completed_ts = moment( data.completed_ts).local().format("D/MM/YYYY HH:mm:ss");
                data.cleared_date_time = moment( data.cleared_date_time).local().format("D/MM/YYYY HH:mm:ss");
                return Promise.resolve(data);
            }))
            let message_response = { "message": "Response Data QTY : "+resultResponse.length+ " record" }
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 200,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("Totalizer_",JSON.stringify(Log_Structure))
            res.send(200,resultResponse)
            return;
          }
          catch(error){
            Log_Structure.response_data = {"message":error.messaeg};
            Log_Structure.response_StatusCode = 500,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.api_error=true
            ServiceLavender.ServiceLog.WriteLog("Totalizer_",JSON.stringify(Log_Structure))    
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
          ServiceLavender.ServiceLog.WriteLog("Totalizer_",JSON.stringify(Log_Structure))  
          res.send(212, message_response)
          return;
		}
      }
      catch (err) {
        Log_Structure.response_data = {"message":err.messaeg};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("Totalizer_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      }
    
}
exports.TotalizerByHose= async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const hose_id = req.params.hoseid
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
  if(!hose_id){
    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("TotalizerByHose_",JSON.stringify(Log_Structure))

    res.send(400,message_response)
    return;
    }
    try{
      let resultQuery = await Connectdb.query(`select hose_id,pump_id,hose_number,total_meter_volume,total_meter_value,total_meter_machanical `+
                                              `FROM lavender.hoses where hose_id = ${hose_id}`)
      if(resultQuery.rowCount > 0){
        try{
          let resultResponse =  await Promise.all(resultQuery.rows.map(async(data,i)=>{
            if(data.total_meter_machanical === null) data.total_meter_machanical = Number(0.00);
            else data.total_meter_machanical = Number(data.total_meter_machanical);
            data.total_meter_value = Number(data.total_meter_value);
            data.total_meter_volume = Number(data.total_meter_volume);
              data.completed_ts = moment( data.completed_ts).local().format("D/MM/YYYY HH:mm:ss");
              data.cleared_date_time = moment( data.cleared_date_time).local().format("D/MM/YYYY HH:mm:ss");
              return Promise.resolve(data);
          }))
          let message_response = { "message": "Response Data QTY : "+resultResponse.length+ " record" }
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 200,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("TotalizerByHose_",JSON.stringify(Log_Structure))
          res.send(200,resultResponse)
          return;
        }
        catch(error){
          Log_Structure.response_data = {"message":error.messaeg};
          Log_Structure.response_StatusCode = 500,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          Log_Structure.api_error=true
          ServiceLavender.ServiceLog.WriteLog("TotalizerByHose_",JSON.stringify(Log_Structure))    
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
        ServiceLavender.ServiceLog.WriteLog("TotalizerByHose_",JSON.stringify(Log_Structure))  
        res.send(212, message_response)
        return;
	  }
	  
    }
    catch (err) {
      Log_Structure.response_data = {"message":err.messaeg};
      Log_Structure.response_StatusCode = 500,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      Log_Structure.api_error=true
      ServiceLavender.ServiceLog.WriteLog("TotalizerByHose_",JSON.stringify(Log_Structure))    
      res.send(500, { "message": err.message})
      return;
    }
     

}
exports.TotalizerByPump= async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const pump_id = req.params.pumpid
  const hose_number = req.params.hosenumber

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

  if(!pump_id || !hose_number){
    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("TotalizerByPump_",JSON.stringify(Log_Structure))

    res.send(400,message_response)
    }
    try{ 
      let resultQuery = await Connectdb.query(`select hose_id,pump_id,hose_number,total_meter_volume,total_meter_value,total_meter_machanical ` +
                                              `FROM lavender.hoses where pump_id = ${pump_id} and hose_number = ${hose_number}`)     
      
      if(resultQuery.rowCount > 0){
        try{
          let resultResponse =  await Promise.all(resultQuery.rows.map(async(data,i)=>{
            if(data.total_meter_machanical === null){
              data.total_meter_machanical = Number(0.00);
            }else{ 
              data.total_meter_machanical = Number(data.total_meter_machanical);
              data.total_meter_value = Number(data.total_meter_value);
              data.total_meter_volume = Number(data.total_meter_volume);
            }
            data.completed_ts = moment( data.completed_ts).local().format("D/MM/YYYY HH:mm:ss");
            data.cleared_date_time = moment( data.cleared_date_time).local().format("D/MM/YYYY HH:mm:ss");
            return Promise.resolve(data);
          }))
          let message_response = { "message": "Response Data QTY : "+resultResponse.length+ " record" }
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 200,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("TotalizerByPump_",JSON.stringify(Log_Structure))
          res.send(200,resultResponse)
          return;
        }
        catch(error){
          Log_Structure.response_data = {"message":error.messaeg};
          Log_Structure.response_StatusCode = 500,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          Log_Structure.api_error=true
          ServiceLavender.ServiceLog.WriteLog("TotalizerByPump_",JSON.stringify(Log_Structure))    
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
        ServiceLavender.ServiceLog.WriteLog("TotalizerByPump_",JSON.stringify(Log_Structure))  
        res.send(212, message_response)
        return;
	  }	  
    }
    catch (err) {
      Log_Structure.response_data = {"message":err.messaeg};
      Log_Structure.response_StatusCode = 500,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      Log_Structure.api_error=true
      ServiceLavender.ServiceLog.WriteLog("TotalizerByPump_",JSON.stringify(Log_Structure))    
      res.send(500, { "message": err.message})
      return;
    }
}
exports.GetTotalizerM= async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const pump_id = req.params.pumpid
  const hose_number = req.params.hosenumber

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

  if(!pump_id || !hose_number){
    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("GetTotalizerM_",JSON.stringify(Log_Structure))

    res.send(400,message_response)
      }
      try{
        let resultQuery = await Connectdb.query(`SELECT pump_id,hose_number,total_meter_machanical FROM lavender.hoses `+
                                                `where pump_id = ${pump_id} and hose_number = ${hose_number}`)  
        if(resultQuery.rowCount > 0){
          try{
            let resultResponse =  await Promise.all(resultQuery.rows.map(async(data,i)=>{
              if(data.total_meter_machanical === null) data.total_meter_machanical = Number(0.00);
              else data.total_meter_machanical = Number(data.total_meter_machanical);
                data.completed_ts = moment( data.completed_ts).local().format("D/MM/YYYY HH:mm:ss");
                data.cleared_date_time = moment( data.cleared_date_time).local().format("D/MM/YYYY HH:mm:ss");
              return Promise.resolve(data);
            }))
            let message_response = { "message": "Response Data QTY : "+resultResponse.length+ " record" }
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 200,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("GetTotalizerM_",JSON.stringify(Log_Structure))
            res.send(200,resultResponse)
            return;
          }
          catch(error){
            Log_Structure.response_data = {"message":error.messaeg};
            Log_Structure.response_StatusCode = 500,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.api_error=true
            ServiceLavender.ServiceLog.WriteLog("GetTotalizerM_",JSON.stringify(Log_Structure))    
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
          ServiceLavender.ServiceLog.WriteLog("GetTotalizerM_",JSON.stringify(Log_Structure))  
          res.send(212, message_response)
          return;
		}
      }
      catch (err) {
        Log_Structure.response_data = {"message":err.messaeg};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("GetTotalizerM_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      }

}

exports.SetTotalizerM= async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const ValueM =  req.body.ValueM;
  const pump_id = req.body.pump_id;
  const hose_number = req.body.hose_number;

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
  
  if(!ValueM ||!pump_id || !hose_number){
    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("SetTotalizerM_",JSON.stringify(Log_Structure))

    res.send(400,message_response)
      }        
    try {
        let resultResponse = await  Connectdb.query(`update lavender.hoses set total_meter_machanical = ${ValueM} where pump_id = ${pump_id} and hose_number = ${hose_number}`)
        if(resultResponse.rowCount === 1){
          let message_response = {"message":"Update Total Meter Machanical by Pump ID : " + pump_id + " Hose Number : " + hose_number + " is success."}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 200,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("SetTotalizerM_",JSON.stringify(Log_Structure))
          ServiceLavender.ServiceBackUp.BackupData([{ tableName : "hoses", pump_id : pump_id, hose_number : hose_number},])   
          res.send(200,message_response)
        }else{
          let message_response = {"message" : "Cannot Update Total Meter Machanical by Pump ID : " + pump_id + " Hose Number : " + hose_number }
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 211,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("SetTotalizerM_",JSON.stringify(Log_Structure))
      
          res.send(211,message_response)
		}		  
      }
      catch (err) {
        Log_Structure.response_data = {"message":err.messaeg};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("SetTotalizerM_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      }

}
