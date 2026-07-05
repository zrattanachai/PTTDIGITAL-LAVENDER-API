const config = require('../config')
const Connectdb = config.dbSettings.pool;
const moment = require('moment')
const ServiceLavender = require('../services/index.js')
const _ = require('lodash');

exports.SetZero = async function (req, res, next){
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const transaction_id = req.body.transaction_id
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

  if (!transaction_id) {
    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("SetZero_",JSON.stringify(Log_Structure))

    res.send(400,message_response)
    return
    }

    try{
        var resultCmd="";
        const { exec } = require('child_process');
        
        exec('su -', (error, stdout, stderr)=> {if(error){resultCmd=error.message;console.log(error.message);return;}if(stderr){console.log(stderr);return;}})
        exec('chmod 755 /usr/share/LavenderAPI/Setting/script/SetZero.sh', (error, stdout, stderr) => { if (error) { console.log(error.message); return; } if (stderr) { console.log(stderr); return; } })
        exec('sed -i "s/\r//g" /usr/share/LavenderAPI/Setting/script/SetZero.sh', (error, stdout, stderr) => { if (error) { console.log(error.message); return; } if (stderr) { console.log(stderr); return; } })
        exec('/usr/share/LavenderAPI/Setting/script/./SetZero.sh ' + transaction_id + " \"gdH[,yogvkw;hg]pmyh'fvdw,h\"", (error, stdout, stderr) => { if (error) { console.log(error.message); return; } if (stderr) { console.log(stderr); return; } })
        //exec('python3 '+'/usr/share/LavenderAPI/Setting/script/transaction_mod.py SetZero '+req.body.transaction_id+" \"gdH[,yogvkw;hg]pmyh'fvdw,h\"", (error, stdout, stderr)=> {if(error){resultCmd=error.message;console.log(error.message);return;}if(stderr){console.log(stderr);return;}})
      

        if(resultCmd==""){
          let message_response = { "message":"SetZero start transaction_id : " + transaction_id + " is successful."}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 200,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("SetZero_",JSON.stringify(Log_Structure))   
        }
        else{
          let message_response = { "message":"SetZero start transaction_id : " + transaction_id + " is fail with meassage : " + resultCmd}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 200,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("SetZero_",JSON.stringify(Log_Structure)) 
        }
      res.send(200, { "message": "SetZero start transaction_id : "+transaction_id+" is successful." })
      return
    }
    catch(err){
      Log_Structure.response_data = { "message": err.message};
      Log_Structure.response_StatusCode = 500,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      Log_Structure.api_error=true
      ServiceLavender.ServiceLog.WriteLog("SetZero_",JSON.stringify(Log_Structure))    
      res.send(500, { "message": err.message})
      return
    } 
}

exports.SetZeroTransaction = async function (req, res, next){
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const transaction_id = req.body.transaction_id
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


  if (!transaction_id) {
    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("SetZeroTransaction_",JSON.stringify(Log_Structure))

    res.send(400,message_response)
    return;
  }
  try{
        var resultCmd="";
        const { exec } = require('child_process');
        
        exec('su -', (error, stdout, stderr)=> {if(error){resultCmd=error.message;console.log(error.message);return;}if(stderr){console.log(stderr);return;}})
        exec('chmod 755 /usr/share/LavenderAPI/Setting/script/SetZeroTransaction.sh', (error, stdout, stderr) => { if (error) { console.log(error.message); return; } if (stderr) { console.log(stderr); return; } })
        exec('sed -i "s/\r//g" /usr/share/LavenderAPI/Setting/script/SetZeroTransaction.sh', (error, stdout, stderr) => { if (error) { console.log(error.message); return; } if (stderr) { console.log(stderr); return; } })
        exec('/usr/share/LavenderAPI/Setting/script/./SetZeroTransaction.sh ' + transaction_id + " \"gdH[,yogvkw;hg]pmyh'fvdw,h\"", (error, stdout, stderr) => { if (error) { console.log(error.message); return; } if (stderr) { console.log(stderr); return; } })
        //exec('python3 '+'/usr/share/LavenderAPI/Setting/script/transaction_mod.py SetZeroTransaction '+req.body.transaction_id+" \"gdH[,yogvkw;hg]pmyh'fvdw,h\"", (error, stdout, stderr)=> {if(error){resultCmd=error.message;console.log(error.message);return;}if(stderr){console.log(stderr);return;}})
      

        if(resultCmd==""){
          let message_response = { "message":"SetZeroTransaction start transaction_id : " + transaction_id + " is successful."}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 200,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("SetZeroTransaction_",JSON.stringify(Log_Structure)) 

        }
        else{
          let message_response = { "message":"SetZeroTransaction start transaction_id : " + transaction_id + " is fail with meassage : " + resultCmd}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 200,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("SetZeroTransaction_",JSON.stringify(Log_Structure)) 
        }
      res.send(200, { "message": "SetZeroTransaction start transaction_id : "+ transaction_id +" is successful." })
      return
    }
    catch(err){
      Log_Structure.response_data = { "message": err.message};
      Log_Structure.response_StatusCode = 500,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      Log_Structure.api_error=true
      ServiceLavender.ServiceLog.WriteLog("SetZeroTransaction_",JSON.stringify(Log_Structure))    
      res.send(500, { "message": err.message})
      return
    } 
  
}

exports.ResetTransaction = async function (req, res, next){
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const transaction_id = req.body.transaction_id
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

  if (!transaction_id) {
    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("ResetTransaction_",JSON.stringify(Log_Structure))

    res.send(400,message_response)
    return;
  }
    try{
        var resultCmd="";
        const { exec } = require('child_process');
        
        exec('su -', (error, stdout, stderr)=> {if(error){resultCmd=error.message;console.log(error.message);return;}if(stderr){console.log(stderr);return;}})
        exec('chmod 755 /usr/share/LavenderAPI/Setting/script/ResetTransaction.sh', (error, stdout, stderr) => { if (error) { console.log(error.message); return; } if (stderr) { console.log(stderr); return; } })
        exec('sed -i "s/\r//g" /usr/share/LavenderAPI/Setting/script/ResetTransaction.sh', (error, stdout, stderr) => { if (error) { console.log(error.message); return; } if (stderr) { console.log(stderr); return; } })
        exec('/usr/share/LavenderAPI/Setting/script/./ResetTransaction.sh ' +transaction_id + " \"gdH[,yogvkw;hg]pmyh'fvdw,h\"", (error, stdout, stderr) => { if (error) { console.log(error.message); return; } if (stderr) { console.log(stderr); return; } })
        //exec('python3 '+'/usr/share/LavenderAPI/Setting/script/transaction_mod.py ResetTransaction '+req.body.transaction_id+" \"gdH[,yogvkw;hg]pmyh'fvdw,h\"", (error, stdout, stderr)=> {if(error){resultCmd=error.message;console.log(error.message);return;}if(stderr){console.log(stderr);return;}})
      

        if(resultCmd==""){
          let message_response = { "message":"ResetTransaction start transaction_id : " + transaction_id + " is successful."}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 200,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("ResetTransaction_",JSON.stringify(Log_Structure)) 

        }
        else{
          let message_response = { "message":"ResetTransaction start transaction_id : " + transaction_id + " is fail with meassage : " + resultCmd}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 200,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("ResetTransaction_",JSON.stringify(Log_Structure)) 

        }
      res.send(200, { "message": "ResetTransaction start transaction_id : "+transaction_id+" is successful." })
      return
    }
    catch(err){
      Log_Structure.response_data = { "message": err.message};
      Log_Structure.response_StatusCode = 500,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      Log_Structure.api_error=true
      ServiceLavender.ServiceLog.WriteLog("ResetTransaction_",JSON.stringify(Log_Structure))    
      res.send(500, { "message": err.message})
      return
    } 
  
}

exports.Processing = async function (req, res, next){
  const fs = require('fs')
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
        var MsgData = "";
        var MsgErr = "";
        const { exec } = require('child_process');
        exec('chmod 755 /usr/share/LavenderAPI/Setting/script/Status.txt', (error, stdout, stderr) => { if (error) { console.log(error.message); return; } if (stderr) { console.log(stderr); return; } })
        fs.readFile('/usr/share/LavenderAPI/Setting/script/Status.txt', 'utf8', function (err, data) {
            if (err) {
                MsgErr = err.replace('\n', '');
                res.send(211, { "message": MsgErr })
            }
            else {
                MsgData = data.replace('\n', '');
                res.send(200, { "message": MsgData });
            }
        });
        await new Promise(resolve => setTimeout(resolve, 200));
        if (MsgData != "") {
          let message_response = { "message": MsgData}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 200,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("Processing_",JSON.stringify(Log_Structure)) 
        }
        else {
          let message_response = { "message": MsgErr}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 200,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("Processing_",JSON.stringify(Log_Structure)) 
        }
    }
    catch(err){
      Log_Structure.response_data = { "message": err.message};
      Log_Structure.response_StatusCode = 500,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      Log_Structure.api_error=true
      ServiceLavender.ServiceLog.WriteLog("Processing_",JSON.stringify(Log_Structure))    
      res.send(500, { "message": err.message})
      return
    }  
}



exports.SetConfigFleetFraud = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const pump_id = req.body.pump_id
  const counting = req.body.counting
  const time_waiting = req.body.time_waiting
  const duration = req.body.duration
  let Log_Structure = {
    time_request:moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
    ip_request: ip_request,
    terminal_id: terminal_id,
    request_body : req.body,
    response_StatusCode:"",
    response_data : "",
    time_response:"",
    api_error:false
  }	

  if (!pump_id || !counting || !time_waiting || !duration ){
    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("SetConfigFleetFraud_",JSON.stringify(Log_Structure))

    res.send(400,message_response)
    return;
    }
      try {
        let checkpumpid = await Connectdb.query(`select count(pump_id) pumpid from lavender.config_fleet_fraud where pump_id = ${pump_id}`);
        if (Number(checkpumpid.rows[0].pumpid) > 0) {
          try {
            let resultResponse = await Connectdb.query(`UPDATE lavender.config_fleet_fraud SET counting = ${Number(counting)}, time_waiting = ${Number(time_waiting)}, duration = ${Number(duration)}, update_time = now() WHERE pump_id = ${pump_id}`)
            if (resultResponse.rowCount === 1){
              let message_response = { "message": "Update Config Fleet Fraud by Pump ID : " + pump_id + " is success." }
              Log_Structure.response_data = message_response;
              Log_Structure.response_StatusCode = 200,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              Log_Structure.api_error=false
              ServiceLavender.ServiceLog.WriteLog("SetConfigFleetFraud_",JSON.stringify(Log_Structure))  
              ServiceLavender.ServiceBackUp.BackupData([{tableName:"config_fleet_fraud",pump_id : pump_id}])
              res.send(200, message_response)
              return;
            }else{
              let message_response = { "message": "Can't update Config Fleet Fraud by Pump ID : " + pump_id + "." }
              Log_Structure.response_data = message_response;
              Log_Structure.response_StatusCode = 400,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              Log_Structure.api_error=false
              ServiceLavender.ServiceLog.WriteLog("SetConfigFleetFraud_",JSON.stringify(Log_Structure))  
              res.send(400, message_response)
              return;
        }
        }
        catch (err){
          Log_Structure.response_data = {"message":err.messaeg};
          Log_Structure.response_StatusCode = 500,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          Log_Structure.api_error=true
          ServiceLavender.ServiceLog.WriteLog("SetConfigFleetFraud_",JSON.stringify(Log_Structure))    
          res.send(500, { "message": err.message})
          return;
        }
        }
          else {
            try{
              let status_insert_config = await Connectdb.query(`INSERT INTO lavender.config_fleet_fraud(pump_id, counting, time_waiting, duration,update_time)
                VALUES (${Number(pump_id)},${Number(counting)},${Number(time_waiting)},${Number(duration)}, now())`)
                if (status_insert_config.rowCount === 1) {
                  let message_response = {"message" : "Insert Config Fleet Fraud by Pump ID : " + pump_id + " is success." }
                  Log_Structure.response_data = message_response;
                  Log_Structure.response_StatusCode = 200,
                  Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                  Log_Structure.api_error=false
                  ServiceLavender.ServiceLog.WriteLog("SetConfigFleetFraud_",JSON.stringify(Log_Structure))
                  ServiceLavender.ServiceBackUp.BackupData([{tableName:"config_fleet_fraud",pump_id : pump_id}])    
                  res.send(200, message_response)
                  return;  
                }else{
                  let message_response = {"message" : "Can't Insert Config Fleet Fraud by Pump ID : " + pump_id}
                  Log_Structure.response_data = message_response;
                  Log_Structure.response_StatusCode = 400,
                  Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                  Log_Structure.api_error=false
                  ServiceLavender.ServiceLog.WriteLog("SetConfigFleetFraud_",JSON.stringify(Log_Structure))  
                  res.send(400, message_response)
                  return;
                }

            }catch(err){
              Log_Structure.response_data = {"message":err.messaeg};
              Log_Structure.response_StatusCode = 500,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              Log_Structure.api_error=true
              ServiceLavender.ServiceLog.WriteLog("SetConfigFleetFraud_",JSON.stringify(Log_Structure))    
              res.send(500, { "message": err.message})
              return;
            }


            }
          }
          catch (err) {
            Log_Structure.response_data = {"message":err.messaeg};
            Log_Structure.response_StatusCode = 500,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.api_error=true
            ServiceLavender.ServiceLog.WriteLog("SetConfigFleetFraud_",JSON.stringify(Log_Structure))    
            res.send(500, { "message": err.message})
            return;
          }
          
}

exports.GetConfigFleetFraud = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  let Log_Structure = {
    time_request:moment().format('YYYY-MM-DD HH:mm:ss'),
    ip_request: ip_request,
    terminal_id: terminal_id,
    request_body : req.params,
    response_StatusCode:"",
    response_data : "",
    time_response:"",
    api_error:false
  }

  try{ 
    let resultQuery = await Connectdb.query(`select * from lavender.config_fleet_fraud`);
        if(resultQuery.rowCount > 0){
          try{
            let resultResponse =  await Promise.all(resultQuery.rows.map(async(data,i)=>{
              data.update_time = moment( data.update_time).local().format("D/MM/YYYY HH:mm:ss");
              return Promise.resolve(data);
            }))
            let message_response = { "message": "Response Data QTY : "+resultResponse.length+ " record" }
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 200,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("GetConfigFleetFraud_",JSON.stringify(Log_Structure))
            res.send(200,resultResponse)
            return;
          }
          catch(err){
            Log_Structure.response_data = {"message":err.messaeg};
            Log_Structure.response_StatusCode = 500,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.api_error=true
            ServiceLavender.ServiceLog.WriteLog("GetConfigFleetFraud_",JSON.stringify(Log_Structure))    
            res.send(500, { "message": err.message})
            return;
          }
        }
        else{
          let message_response = {"message" : "Can't find Config Fleet Fraud."}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 400,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          Log_Structure.api_error=false
          ServiceLavender.ServiceLog.WriteLog("GetConfigFleetFraud_",JSON.stringify(Log_Structure))  
          res.send(400, message_response)
          return;
		}
      }
      catch (err) {
        Log_Structure.response_data = {"message":err.messaeg};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("GetConfigFleetFraud_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      }
    
}

exports.DeleteConfigFleetFraud = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const pump_id = req.body.pump_id
  let Log_Structure = {
    time_request:moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
    ip_request: ip_request,
    terminal_id: terminal_id,
    request_body : req.body,
    response_StatusCode:"",
    response_data : "",
    time_response:"",
    api_error:false
  }	

  if (!pump_id){
    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("DeleteConfigFleetFraud_",JSON.stringify(Log_Structure))

    res.send(400,message_response)
    return;
    }
      try {
        let checkpumpid = await Connectdb.query(`select count(pump_id) pumpid from lavender.config_fleet_fraud where pump_id = ${pump_id}`);
        if (Number(checkpumpid.rows[0].pumpid) > 0) {
          try {
            let resultResponse = await Connectdb.query(`delete from lavender.config_fleet_fraud where pump_id = ${pump_id}`)
            if (resultResponse.rowCount === 1){
              let message_response = { "message": "Delete Config Fleet Fraud by Pump ID : " + pump_id + " is success." }
              Log_Structure.response_data = message_response;
              Log_Structure.response_StatusCode = 200,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              Log_Structure.api_error=false
              ServiceLavender.ServiceLog.WriteLog("DeleteConfigFleetFraud_",JSON.stringify(Log_Structure))
              ServiceLavender.ServiceBackUp.BackupData([{tableName:"config_fleet_fraud",pump_id : pump_id,condition :"delete"}])  
              res.send(200, message_response)
              return;
            }else{
              let message_response = { "message": "Can't Delete Config Fleet Fraud by Pump ID : " + pump_id + "." }
              Log_Structure.response_data = message_response;
              Log_Structure.response_StatusCode = 400,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              Log_Structure.api_error=false
              ServiceLavender.ServiceLog.WriteLog("DeleteConfigFleetFraud_",JSON.stringify(Log_Structure))  
              res.send(400, message_response)
              return;
        }
        }
        catch (err){
          Log_Structure.response_data = {"message":err.messaeg};
          Log_Structure.response_StatusCode = 500,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          Log_Structure.api_error=true
          ServiceLavender.ServiceLog.WriteLog("DeleteConfigFleetFraud_",JSON.stringify(Log_Structure))    
          res.send(500, { "message": err.message})
          return;
        }
        }
          else {
            let message_response = { "message": "Can't Find Config Fleet Fraud by Pump ID : " + pump_id + "." }
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 212,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.api_error=false
            ServiceLavender.ServiceLog.WriteLog("DeleteConfigFleetFraud_",JSON.stringify(Log_Structure))  
            res.send(212, message_response)
            return;

          }
          }
          catch (err) {
            Log_Structure.response_data = {"message":err.messaeg};
            Log_Structure.response_StatusCode = 500,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.api_error=true
            ServiceLavender.ServiceLog.WriteLog("DeleteConfigFleetFraud_",JSON.stringify(Log_Structure))    
            res.send(500, { "message": err.message})
            return;
          }
          
}
