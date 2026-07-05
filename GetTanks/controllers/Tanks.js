const config = require('../config')
const Connectdb = config.dbSettings.pool;
const moment = require('moment')
const ServiceLavender = require('../services/index.js')
const _ = require('lodash');

exports.TankInfo = async function (req, res, next) {
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
    let resultQuery = await Connectdb.query("SELECT * FROM lavender.tanks order by tank_id")       
        if(resultQuery.rowCount > 0){
          try{
            let resultResponse =  await Promise.all(resultQuery.rows.map(async(data,i)=>{
              return Promise.resolve(data);
            }))
            let message_response = { "message": "Response Data QTY : "+resultResponse.length+ " record" }
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 200,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("TankInfo_",JSON.stringify(Log_Structure))
            res.send(200,resultResponse)
            return;
          }
          catch(error){
            Log_Structure.response_data = error.messaeg;
            Log_Structure.response_StatusCode = 500,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.api_error=true
            ServiceLavender.ServiceLog.WriteLog("TankInfo_",JSON.stringify(Log_Structure))    
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
          ServiceLavender.ServiceLog.WriteLog("TankInfo_",JSON.stringify(Log_Structure))  
          res.send(212, message_response)
          return;
		}
      }
      catch(err){
        Log_Structure.response_data = err.messaeg;
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("TankInfo_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      }
}

exports.TankInfoByTankID = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const tank_id = req.params.tankid;
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

  if(!tank_id){
    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("TankInfoByTankID_",JSON.stringify(Log_Structure))

    res.send(400,message_response)
    return;
      }
      try{
        let resultQuery = await Connectdb.query(`SELECT * FROM lavender.tanks WHERE tank_id = ${tank_id}`)       
        if(resultQuery.rowCount > 0){
          try{
            let resultResponse =  await Promise.all(resultQuery.rows.map(async(data,i)=>{
              return Promise.resolve(data);
            }))
            let message_response = { "message": "Response Data QTY : "+resultResponse.length+ " record" }
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 200,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("TankInfoByTankID_",JSON.stringify(Log_Structure))
            res.send(200,resultResponse)
            return;
	      }
          catch(error){
            Log_Structure.response_data = error.messaeg;
            Log_Structure.response_StatusCode = 500,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.api_error=true
            ServiceLavender.ServiceLog.WriteLog("TankInfoByTankID_",JSON.stringify(Log_Structure))    
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
          ServiceLavender.ServiceLog.WriteLog("TankInfoByTankID_",JSON.stringify(Log_Structure))  
          res.send(212, message_response)
          return;
		}
      }
      catch(err){
        Log_Structure.response_data = err.messaeg;
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("TankInfoByTankID_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      }
}

exports.TankInventory = async function (req, res, next) {
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
    let resultQuery = await Connectdb.query("SELECT tank_id, tank_name, gauge_volume, gauge_tc_volume, temperature, ullage, theoretical_volume, water_level, water_volume FROM lavender.tanks order by tank_id")                  
        if(resultQuery.rowCount > 0){
          try{
            let resultResponse =  await Promise.all(resultQuery.rows.map(async(data,i)=>{
              data.completed_ts = moment(data.completed_ts).local().format("D/MM/YYYY HH:mm:ss");
              data.cleared_date_time = moment(data.cleared_date_time).local().format("D/MM/YYYY HH:mm:ss");
              return Promise.resolve(data);
            }))
            let message_response = { "message": "Response Data QTY : "+resultResponse.length+ " record" }
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 200,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("TankInventory_",JSON.stringify(Log_Structure))
            res.send(200,resultResponse)
            return;
          }
          catch(err){
            Log_Structure.response_data = err.messaeg;
            Log_Structure.response_StatusCode = 500,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.api_error=true
            ServiceLavender.ServiceLog.WriteLog("TankInventory_",JSON.stringify(Log_Structure))    
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
          ServiceLavender.ServiceLog.WriteLog("TankInventory_",JSON.stringify(Log_Structure))  
          res.send(212, message_response)
          return;
		}
      }
      catch(err){
        Log_Structure.response_data = err.messaeg;
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("TankInventory_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      } 
}
exports.TankInventoryByTankID = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const tank_id = req.params.tankid
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

  if(!tank_id){
    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("TankInventoryByTankID_",JSON.stringify(Log_Structure))

    res.send(400,message_response)
    return;
    }
      try{
        let resultQuery = await Connectdb.query(`SELECT tank_id, tank_name, gauge_volume, gauge_tc_volume, temperature, ullage, theoretical_volume, water_level, water_volume FROM lavender.tanks WHERE tank_id = ${tank_id}`)
               
        if(resultQuery.rowCount > 0){
          try{
            let resultResponse =  await Promise.all(resultQuery.rows.map(async(data,i)=>{
              data.completed_ts = moment(data.completed_ts).local().format("D/MM/YYYY HH:mm:ss");
              data.cleared_date_time = moment(data.cleared_date_time).local().format("D/MM/YYYY HH:mm:ss");
              return Promise.resolve(data);
            }))
            let message_response = { "message": "Response Data QTY : "+resultResponse.length+ " record" }
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 200,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("TankInventoryByTankID_",JSON.stringify(Log_Structure))
            res.send(200,resultResponse)
          }
          catch(error){
            Log_Structure.response_data = error.messaeg;
            Log_Structure.response_StatusCode = 500,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.api_error=true
            ServiceLavender.ServiceLog.WriteLog("TankInventoryByTankID_",JSON.stringify(Log_Structure))    
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
          ServiceLavender.ServiceLog.WriteLog("TankInventoryByTankID_",JSON.stringify(Log_Structure))  
          res.send(212, message_response)
          return;
		}
      }
      catch(err){
        Log_Structure.response_data = err.messaeg;
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("TankInventoryByTankID_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      }
}
exports.TankAlarm = async function (req, res, next) {
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
    let resultQuery = await Connectdb.query("SELECT tank_id, tank_name, CONCAT(tank_alarm_category, tank_alarm_type) as tank_alarm_code, tank_alarm_description, low_volume_alarm, high_volume_alarm FROM lavender.tanks order by tank_id")    
        if(resultQuery.rowCount > 0){
          try{
              let resultResponse = await Promise.all(resultQuery.rows.map(async (data, i) => {
              data.completed_ts = moment(data.completed_ts).local().format("D/MM/YYYY HH:mm:ss");
              data.cleared_date_time = moment(data.cleared_date_time).local().format("D/MM/YYYY HH:mm:ss");
              return Promise.resolve(data);
            }))
            let message_response = { "message": "Response Data QTY : "+resultResponse.length+ " record" }
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 200,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("TankAlarm_",JSON.stringify(Log_Structure))
            res.send(200,resultResponse)
	        }
          catch(error){
            Log_Structure.response_data = err.messaeg;
            Log_Structure.response_StatusCode = 500,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.api_error=true
            ServiceLavender.ServiceLog.WriteLog("TankAlarm_",JSON.stringify(Log_Structure))    
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
          ServiceLavender.ServiceLog.WriteLog("TankAlarm_",JSON.stringify(Log_Structure))  
          res.send(212, message_response)
          return;
		  }
      }
      catch(err){
        Log_Structure.response_data = err.messaeg;
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("TankAlarm_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      }
}

exports.TankAlarmByTankID = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const tank_id = req.params.tankid
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

  if(!tank_id){
    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("TankAlarmByTankID_",JSON.stringify(Log_Structure))

    res.send(400,message_response)
    return;
    }
      try{
        errCode = 211;
        errDescription = ", Invalid SQL statement.";
          let resultQuery = await Connectdb.query("SELECT tank_id, tank_name, CONCAT(tank_alarm_category, tank_alarm_type) as tank_alarm_code, tank_alarm_description, low_volume_alarm, high_volume_alarm FROM lavender.tanks WHERE tank_id = " + tank_id + "")
              
        if(resultQuery.rowCount > 0){
          try{
              let resultResponse = await Promise.all(resultQuery.rows.map(async (data, i) => {
              data.completed_ts = moment(data.completed_ts).local().format("D/MM/YYYY HH:mm:ss");
              data.cleared_date_time = moment(data.cleared_date_time).local().format("D/MM/YYYY HH:mm:ss");
              return Promise.resolve(data);
            }))
            let message_response = { "message": "Response Data QTY : "+resultResponse.length+ " record" }
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 200,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("TankAlarmByTankID_",JSON.stringify(Log_Structure))
            res.send(200,resultResponse)
          }
          catch(err){
            Log_Structure.response_data = err.messaeg;
            Log_Structure.response_StatusCode = 500,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.api_error=true
            ServiceLavender.ServiceLog.WriteLog("TankAlarmByTankID_",JSON.stringify(Log_Structure))    
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
          ServiceLavender.ServiceLog.WriteLog("TankAlarmByTankID_",JSON.stringify(Log_Structure))  
          res.send(212, message_response)
          return;
		    }
      }
      catch(err){
        Log_Structure.response_data = {"message":err.messaeg};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("TankAlarmByTankID_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      }
}

exports.TankTheoreticalByTank = async function (req, res, next){
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const tank_id =  req.body.tank_id
  const theoretical_volume = req.body.theoretical_volume
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

  if(!tank_id ||!theoretical_volume){
    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("TankTheoreticalByTank_",JSON.stringify(Log_Structure))

    res.send(400,message_response)
    return;
    }          
    try {
        let getVolume = await Connectdb.query(`SELECT theoretical_volume FROM lavender.tanks WHERE tank_id = ${tank_id}`)
        if(getVolume.rowCount !== 0){
          try{
            getVolume.rows.map(async (data, i)=>{
              try {
                let newVolume = Number(data.theoretical_volume) + Number(theoretical_volume);
                let ResultResponse = await Connectdb.query(`UPDATE lavender.tanks SET theoretical_volume = ${newVolume} WHERE tank_id = ${tank_id}`)
                if(ResultResponse.rowCount === 1){
                  let message_response = {"message":"Update Theoretical Volume by Tank ID : " + tank_id + " is success."}
                  Log_Structure.response_data = message_response;
                  Log_Structure.response_StatusCode = 200,
                  Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                  Log_Structure.api_error=false
                  ServiceLavender.ServiceLog.WriteLog("TankTheoreticalByTank_",JSON.stringify(Log_Structure))
                  ServiceLavender.ServiceBackUp.BackupData([{tableName :"tanks",tank_id :tank_id}]) 
                  res.send(200, message_response)
                  return;

                }else{
                  let message_response = {"message" : "Cannot Update Theoretical Volume by Tank ID : " + tank_id+"."}
                  Log_Structure.response_data = message_response;
                  Log_Structure.response_StatusCode = 211,
                  Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                  Log_Structure.api_error=false
                  ServiceLavender.ServiceLog.WriteLog("TankTheoreticalByTank_",JSON.stringify(Log_Structure))  
                  res.send(211, message_response)
                  return;
				}
              }
              catch (error) {
                Log_Structure.response_data = {"message":error.messaeg};
                Log_Structure.response_StatusCode = 500,
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                Log_Structure.api_error=true
                ServiceLavender.ServiceLog.WriteLog("TankTheoreticalByTank_",JSON.stringify(Log_Structure))    
                res.send(500, { "message": error.message})
                return;
              }
            })
          }
          catch(err){
            Log_Structure.response_data = {"message":err.messaeg};
            Log_Structure.response_StatusCode = 500,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.api_error=true
            ServiceLavender.ServiceLog.WriteLog("TankTheoreticalByTank_",JSON.stringify(Log_Structure))    
            res.send(500, { "message": err.message})
            return;
          }
        }
        else {
          let message_response = {"message" : "Incorrect Parameter."}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 400,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          Log_Structure.api_error=false
          ServiceLavender.ServiceLog.WriteLog("TankTheoreticalByTank_",JSON.stringify(Log_Structure))  
          res.send(400, message_response)
          return;
        }
      }
      catch (error) {
        Log_Structure.response_data = {"message":error.messaeg};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("TankTheoreticalByTank_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": error.message})
        return;
      }
    
}
exports.TankDelivery = async function (req, res, next) {
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
      let DataResults = await Connectdb.query("select tank_id from lavender.tanks")
        try{
          if(DataResults.rowCount > 0){
            let resultResponse = await Promise.all(DataResults.rows.map(async (data,i)=>{
              try {
                let dataResponse = await Connectdb.query("SELECT tank_id, start_date_time, end_date_time, start_volume, end_volume, start_tc_volume, end_tc_volume, start_water, end_water, start_height, end_height, start_temperature, end_temperature, date_time_update "+
                  "FROM lavender.tanks_delivery "+
                  "WHERE tank_id = " + data.tank_id +
                  " ORDER by end_date_time DESC LIMIT 1")
                  if(dataResponse.rowCount !== 0){
                    try{
                      let result = await Promise.all(dataResponse.rows.map(async(item,i)=>{
                          item.start_date_time = moment(item.start_date_time).local().format("D/MM/YYYY HH:mm:ss");
                          item.end_date_time = moment(item.end_date_time).local().format("D/MM/YYYY HH:mm:ss");
                          item.date_time_update = moment(item.date_time_update).local().format("D/MM/YYYY HH:mm:ss");
                          return Promise.resolve(item);
                      }))
                      return Promise.resolve((dataResponse.rows.length > 0) ? dataResponse.rows : null)
                    }
                    catch(err){
                      Log_Structure.response_data = {"message":err.messaeg};
                      Log_Structure.response_StatusCode = 500,
                      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                      Log_Structure.api_error=true
                      ServiceLavender.ServiceLog.WriteLog("TankDelivery_",JSON.stringify(Log_Structure))    
                      res.send(500, { "message": err.message})
                      return;
                    }
                  }

              } 
              catch (error) {
                Log_Structure.response_data = {"message":err.messaeg};
                Log_Structure.response_StatusCode = 500,
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                Log_Structure.api_error=true
                ServiceLavender.ServiceLog.WriteLog("TankDelivery_",JSON.stringify(Log_Structure))    
                res.send(500, { "message": err.message})
                return;
              }
            }))
            try{
              var filtered = resultResponse.filter(function (el) {return el != null;});
        
              var newArr = [];
              for(var i = 0; i < filtered.length; i++)
              {
                newArr = newArr.concat(filtered[i]);
              }
              if(newArr.length > 0){
              let message_response = { "message": "Response Data QTY : "+newArr.length+ " record" }
              Log_Structure.response_data = message_response;
              Log_Structure.response_StatusCode = 200,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              Log_Structure.api_error=false
              ServiceLavender.ServiceLog.WriteLog("TankDelivery_",JSON.stringify(Log_Structure))  
              res.send(200, newArr)
              return;
              }else{
                let message_response = {"message" : "Incorrect Parameter."}
                Log_Structure.response_data = message_response;
                Log_Structure.response_StatusCode = 400,
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                Log_Structure.api_error=false
                ServiceLavender.ServiceLog.WriteLog("TankDelivery_",JSON.stringify(Log_Structure))  
                res.send(400, message_response)
                return;
        
              }
            }
            catch(err){
              Log_Structure.response_data = {"message":err.messaeg};
              Log_Structure.response_StatusCode = 500,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              Log_Structure.api_error=true
              ServiceLavender.ServiceLog.WriteLog("TankDelivery_",JSON.stringify(Log_Structure))    
              res.send(500, { "message": err.message})
              return;
            }
          }
          else{
            let message_response = {"message" : "Incorrect Parameter."}
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 400,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.api_error=false
            ServiceLavender.ServiceLog.WriteLog("TankDelivery_",JSON.stringify(Log_Structure))  
            res.send(400, message_response)
            return;
          }
        }
        catch(err){
          Log_Structure.response_data = {"message":err.messaeg};
          Log_Structure.response_StatusCode = 500,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          Log_Structure.api_error=true
          ServiceLavender.ServiceLog.WriteLog("TankDelivery_",JSON.stringify(Log_Structure))    
          res.send(500, { "message": err.message})
          return;
        }
      }
      catch(err){
        Log_Structure.response_data = {"message":err.messaeg};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("TankDelivery_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      }
    
}
exports.TankDeliveryByTankID = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const tank_id = req.params.tank_id
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

  if(!tank_id){
    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("TankDeliveryByTankID_",JSON.stringify(Log_Structure))

    res.send(400,message_response)
    return;
    }
      try{
        errCode = 211;
        errDescription = ", Invalid SQL statement.";
        let resultQuery = await Connectdb.query("SELECT tank_id, start_date_time, end_date_time, start_volume, end_volume, start_tc_volume, end_tc_volume, start_water, end_water, start_height, end_height, start_temperature, end_temperature, date_time_update "+
                        "FROM lavender.tanks_delivery "+
                        "WHERE tank_id = " + tank_id +
                        " ORDER by end_date_time DESC LIMIT 1")
                     
        if(resultQuery.rowCount > 0){
          try{
            let resultResponse =  await Promise.all(resultQuery.rows.map(async(data,i)=>{
              data.start_date_time = moment(data.start_date_time).local().format("D/MM/YYYY HH:mm:ss");
              data.end_date_time = moment(data.end_date_time).local().format("D/MM/YYYY HH:mm:ss");
              data.date_time_update = moment(data.date_time_update).local().format("D/MM/YYYY HH:mm:ss");
              return Promise.resolve(data);
            }))
            let message_response = { "message": "Response Data QTY : "+resultResponse.length+ " record" }
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 200,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("TankDeliveryByTankID_",JSON.stringify(Log_Structure))
            res.send(200,resultResponse)
            return;
          }
          catch(err){
            Log_Structure.response_data = {"message":err.messaeg};
            Log_Structure.response_StatusCode = 500,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.api_error=true
            ServiceLavender.ServiceLog.WriteLog("TankDeliveryByTankID_",JSON.stringify(Log_Structure))    
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
          ServiceLavender.ServiceLog.WriteLog("TankDeliveryByTankID_",JSON.stringify(Log_Structure))  
          res.send(212, message_response)
          return;
		}
      }
      catch(err){
        Log_Structure.response_data = {"message":err.messaeg};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("TankDeliveryByTankID_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      }

}
exports.TankSetDipProduct = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const tank_id = req.body.tank_id
  const dip_level = req.body.dip_level
  const dip_volume = req.body.dip_volume
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

  if (!tank_id || !dip_level || !dip_volume){
    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("TankSetDipProduct_",JSON.stringify(Log_Structure))

    res.send(400,message_response)
    return;
    }
      try {
        let checktankid = await Connectdb.query(`select count(tank_id) from lavender.tanks where tank_id = ${tank_id}`);
        if (Number(checktankid.rows[0].count) > 0) {
          try {
            let resultResponse = await Connectdb.query(`UPDATE lavender.tanks SET dip_level = ${dip_level}, dip_volume = ${dip_volume} WHERE tank_id = ${tank_id}`)
            if (resultResponse.rowCount === 1){
              let message_response = { "message": "Update Dip Level and Dip Volume by Tank ID : " + tank_id + " is success." }
              Log_Structure.response_data = message_response;
              Log_Structure.response_StatusCode = 200,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              Log_Structure.api_error=false
              ServiceLavender.ServiceLog.WriteLog("TankSetDipProduct_",JSON.stringify(Log_Structure))
              ServiceLavender.ServiceBackUp.BackupData([{tableName :"tanks",tank_id :tank_id}])  
              res.send(200, message_response)
              return;
            }else{
              let message_response = { "message": "Can not update Dip Level and Dip Volume by Tank ID : " + tank_id + "." }
              Log_Structure.response_data = message_response;
              Log_Structure.response_StatusCode = 211,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              Log_Structure.api_error=false
              ServiceLavender.ServiceLog.WriteLog("TankSetDipProduct_",JSON.stringify(Log_Structure))  
              res.send(211, message_response)
        }
        }
        catch (err){
          Log_Structure.response_data = {"message":err.messaeg};
          Log_Structure.response_StatusCode = 500,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          Log_Structure.api_error=true
          ServiceLavender.ServiceLog.WriteLog("TankSetDipProduct_",JSON.stringify(Log_Structure))    
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
            ServiceLavender.ServiceLog.WriteLog("TankSetDipProduct_",JSON.stringify(Log_Structure))  
            res.send(212, message_response)
            return;
            }
          }
          catch (err) {
            Log_Structure.response_data = {"message":err.messaeg};
            Log_Structure.response_StatusCode = 500,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.api_error=true
            ServiceLavender.ServiceLog.WriteLog("TankSetDipProduct_",JSON.stringify(Log_Structure))    
            res.send(500, { "message": err.message})
            return;
          }
          
}
exports.TankSetDensity = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const tank_id = req.body.tank_id;
  const density = req.body.density;
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

  if (!tank_id || !density) {
    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("TankSetDensity_",JSON.stringify(Log_Structure))

    res.send(400,message_response)
    return;
    }
          try {
              let checktankid = await Connectdb.query(`select count(tank_id) from lavender.tanks where tank_id = ${tank_id}`);
              if (Number(checktankid.rows[0].count) > 0) {
                try {
                  let resultResponse = await Connectdb.query(`UPDATE lavender.tanks SET density = ${density} WHERE tank_id = ${tank_id}`)
                  if (resultResponse.rowCount === 1){
                    let message_response = { "message": "Update Density by Tank ID : " + tank_id + " is success." }
                    Log_Structure.response_data = message_response;
                    Log_Structure.response_StatusCode = 200,
                    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                    Log_Structure.api_error=false
                    ServiceLavender.ServiceLog.WriteLog("TankSetDensity_",JSON.stringify(Log_Structure))
                    ServiceLavender.ServiceBackUp.BackupData([{tableName :"tanks",tank_id :tank_id}])  
                    res.send(200, message_response)
                    return;
                  }else{
                    let message_response = { "message": "Can not update Density by Tank ID : " + tank_id + "." }
                    Log_Structure.response_data = message_response;
                    Log_Structure.response_StatusCode = 200,
                    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                    Log_Structure.api_error=false
                    ServiceLavender.ServiceLog.WriteLog("TankSetDensity_",JSON.stringify(Log_Structure))  
                    res.send(200, message_response)
                    return;
            }
              }
              catch (err) {
                Log_Structure.response_data = {"message":err.messaeg};
                Log_Structure.response_StatusCode = 500,
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                Log_Structure.api_error=true
                ServiceLavender.ServiceLog.WriteLog("TankSetDensity_",JSON.stringify(Log_Structure))    
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
                ServiceLavender.ServiceLog.WriteLog("TankSetDensity_",JSON.stringify(Log_Structure))  
                res.send(212, message_response)
                return;
              }
          }
          catch (err) {
            Log_Structure.response_data = {"message":err.messaeg};
            Log_Structure.response_StatusCode = 500,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.api_error=true
            ServiceLavender.ServiceLog.WriteLog("TankSetDensity_",JSON.stringify(Log_Structure))    
            res.send(500, { "message": err.message})
            return;
          }

}
exports.ClearTheoreticalVolumeByTank = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const tank_id = req.body.tank_id;
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

    if (!tank_id) {
      let message_response = { "message": "Incorrect Parameter or Parameter format." }
      Log_Structure.response_data = message_response;
      Log_Structure.response_StatusCode = 400,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      ServiceLavender.ServiceLog.WriteLog("ClearTheoreticalVolumeByTank_",JSON.stringify(Log_Structure))
  
      res.send(400,message_response)
      return;
      }

      try {
        let getVolume = await Connectdb.query(`SELECT theoretical_volume FROM lavender.tanks WHERE tank_id = ${tank_id}`)
          if (getVolume.rowCount !== 0) {
            try {
                getVolume.rows.map(async (data, i) => {
                  try {
                      let ResultResponse = await Connectdb.query(`UPDATE lavender.tanks SET theoretical_volume = 0 WHERE tank_id = ${tank_id}`)
                      if (ResultResponse.rowCount === 1){
                        let message_response = { "message": "Clear Theoretical Volume by Tank ID : " + tank_id + " is success." }
                        Log_Structure.response_data = message_response;
                        Log_Structure.response_StatusCode = 200,
                        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                        Log_Structure.api_error=false
                        ServiceLavender.ServiceLog.WriteLog("ClearTheoreticalVolumeByTank_",JSON.stringify(Log_Structure)) 
                        ServiceLavender.ServiceBackUp.BackupData([{tableName :"tanks",tank_id :tank_id}]) 
                        res.send(200, message_response)
                        return;
                      }else{
                        let message_response = { "message": "Can not Clear Theoretical Volume by Tank ID : " + tank_id + "." }
                        Log_Structure.response_data = message_response;
                        Log_Structure.response_StatusCode = 211,
                        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                        Log_Structure.api_error=false
                        ServiceLavender.ServiceLog.WriteLog("ClearTheoreticalVolumeByTank_",JSON.stringify(Log_Structure))  
                        res.send(211, message_response)
                        return;
								    }
                    }
                      catch (err) {
                        Log_Structure.response_data = {"message":err.messaeg};
                        Log_Structure.response_StatusCode = 500,
                        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                        Log_Structure.api_error=true
                        ServiceLavender.ServiceLog.WriteLog("ClearTheoreticalVolumeByTank_",JSON.stringify(Log_Structure))    
                        res.send(500, { "message": err.message})
                        return;
                        }
                        })
                    }
                    catch (err) {
                      Log_Structure.response_data = {"message":err.messaeg};
                      Log_Structure.response_StatusCode = 500,
                      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                      Log_Structure.api_error=true
                      ServiceLavender.ServiceLog.WriteLog("ClearTheoreticalVolumeByTank_",JSON.stringify(Log_Structure))    
                      res.send(500, { "message": err.message})
                      return;
                    }
                }
                else {
                  let message_response = {"message" : "Incorrect Parameter."}
                  Log_Structure.response_data = message_response;
                  Log_Structure.response_StatusCode = 400,
                  Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                  Log_Structure.api_error=false
                  ServiceLavender.ServiceLog.WriteLog("ClearTheoreticalVolumeByTank_",JSON.stringify(Log_Structure))  
                  res.send(400, message_response)
                  return;
                }
            }
        catch (err) {
          Log_Structure.response_data = {"message":err.messaeg};
          Log_Structure.response_StatusCode = 500,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          Log_Structure.api_error=true
          ServiceLavender.ServiceLog.WriteLog("ClearTheoreticalVolumeByTank_",JSON.stringify(Log_Structure))    
          res.send(500, { "message": err.message})
          return;
        }
      
 
}
