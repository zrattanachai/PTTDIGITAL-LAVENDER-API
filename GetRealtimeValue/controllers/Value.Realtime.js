const config = require('../config')
const ServiceLavender = require('../services/index.js')
const moment = require('moment')
const Connectdb = config.dbSettings.pool; 
// var amqp = require('amqplib/callback_api');
exports.CurrentStatus_v2= async function (req, res, next) {
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

          let resultQuery = await Connectdb.query(` SELECT 
        rel.pump_id,
        rel.status,
        rel.last_update,
        rel.alarm,
        tran1.trans
       FROM lavender.pumps_real_time rel
         LEFT JOIN ( SELECT transactions.pump_id,
                json_agg(json_build_object('transaction_id', transactions.transaction_id, 'hose_id', transactions.hose_id, 'completed_ts', to_char(transactions.completed_ts, 'DD/MM/YYYY HH24:MI:SS'::text), 'delivery_type', transactions.delivery_type, 'delivery_volume', to_char(transactions.delivery_volume, 'FM99999999999999999999.990'::text), 'delivery_value', to_char(transactions.delivery_value, 'FM99999999999999999999.990'::text), 'sell_price', to_char(transactions.sell_price, 'FM999.990'::text), 'cleared_by', transactions.cleared_by, 'reserved_by', transactions.reserved_by, 'total_meter_volume', to_char(transactions.total_meter_volume, 'FM99999999999999999999.990'::text), 'total_meter_value', to_char(transactions.total_meter_value, 'FM99999999999999999999.990'::text)) ORDER BY transactions.delivery_type, transactions.transaction_id) AS trans
               FROM lavender.transactions
              WHERE transactions.delivery_type = ANY (ARRAY[1, 2])
              GROUP BY transactions.pump_id) tran1 ON rel.pump_id = tran1.pump_id
      ORDER BY rel.pump_id`)    
        
        if(resultQuery.rowCount > 0){
          try{
            let resultResponse = await Promise.all(resultQuery.rows.map(async (data,i)=>{
              let checkSetprice = await Connectdb.query("SELECT * FROM lavender.pump_commands WHERE command = 'set price' and status = false and pump_id = "+data.pump_id+" ORDER BY command_id DESC LIMIT 1")
              if(checkSetprice.rowCount !== 0 && (data.status === "Locked" || data.status === "Temp Stopped"))
                data.status = "Price Changing";
              data.status_code = await map_status(data.status);
              data.last_update =  moment(data.last_update).local().format("D/MM/YYYY HH:mm:ss");
              return Promise.resolve(data);
            }))  
            let message_response = resultResponse
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 200,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("CurrentStatus_",JSON.stringify(Log_Structure))
            res.send(200,message_response)
            return;
          }
          catch(err){
            Log_Structure.response_data = { "message": err.message};
            Log_Structure.response_StatusCode = 500,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.api_error=true
            ServiceLavender.ServiceLog.WriteLog("CurrentStatus_",JSON.stringify(Log_Structure))    
            res.send(500, { "message": err.message})
            return;
		
          }
        }
        else {
          let message_response = {"message" : "Result not found."}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 212,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("CurrentStatus_",JSON.stringify(Log_Structure))
          res.send(212,message_response)
          return;
		  
	
        }
      }
      catch(err){
        Log_Structure.response_data = { "message": err.message};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("CurrentStatus_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
	      }
    
  

}

exports.CurrentStatusByPump_v2 = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const pump_id = req.params.pumpid
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
        if(!pump_id ){
          let message_response = { "message": "Incorrect Parameter or Parameter format." }
                Log_Structure.response_data = message_response;
                Log_Structure.response_StatusCode = 400,
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                ServiceLavender.ServiceLog.WriteLog("CurrentStatusByPump_",JSON.stringify(Log_Structure))
                res.send(400,message_response)
                return
      
        }

   let resultQuery = await Connectdb.query(`
          select * from (
            SELECT rel.pump_id,
               rel.status,
               rel.last_update,
               rel.alarm,
               tran1.trans
              FROM lavender.pumps_real_time rel
                LEFT JOIN ( SELECT transactions.pump_id,
                       json_agg(json_build_object('transaction_id', transactions.transaction_id, 'hose_id', transactions.hose_id, 'completed_ts', to_char(transactions.completed_ts, 'DD/MM/YYYY HH24:MI:SS'::text), 'delivery_type', transactions.delivery_type, 'delivery_volume', to_char(transactions.delivery_volume, 'FM99999999999999999999.990'::text), 'delivery_value', to_char(transactions.delivery_value, 'FM99999999999999999999.990'::text), 'sell_price', to_char(transactions.sell_price, 'FM999.990'::text), 'cleared_by', transactions.cleared_by, 'reserved_by', transactions.reserved_by, 'total_meter_volume', to_char(transactions.total_meter_volume, 'FM99999999999999999999.990'::text), 'total_meter_value', to_char(transactions.total_meter_value, 'FM99999999999999999999.990'::text)) ORDER BY transactions.delivery_type, transactions.transaction_id) AS trans
                      FROM lavender.transactions
                     WHERE transactions.delivery_type = ANY (ARRAY[1, 2])
                     GROUP BY transactions.pump_id) tran1 ON rel.pump_id = tran1.pump_id
             ORDER BY rel.pump_id  ) query_bypump
             where query_bypump.pump_id = ${pump_id}
           `)             
        if(resultQuery.rowCount > 0){
          try{
            let resultResponse = await Promise.all(resultQuery.rows.map(async (data,i)=>{
              let checkSetprice = await Connectdb.query("SELECT * FROM lavender.pump_commands WHERE command = 'set price' and status = false and pump_id = "+data.pump_id+" ORDER BY command_id DESC LIMIT 1")
              if(checkSetprice.rowCount !== 0 && (data.status === "Locked" || data.status === "Temp Stopped"))
                data.status = "Price Changing";
              data.status_code = await map_status(data.status);
              //data.event_code = await map_event(data.status);
              //data.event_description = await map_eventDesc(data.status);
              data.last_update =  moment(data.last_update).local().format("D/MM/YYYY HH:mm:ss");
              return Promise.resolve(data);
            }))  
            let message_response = resultResponse
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 200,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("CurrentStatusByPump_",JSON.stringify(Log_Structure))
            res.send(200,message_response)
            return;
			
	
          }
          catch(err){
            Log_Structure.response_data = { "message": err.message};
            Log_Structure.response_StatusCode = 500,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.api_error=true
            ServiceLavender.ServiceLog.WriteLog("CurrentStatusByPump_",JSON.stringify(Log_Structure))    
            res.send(500, { "message": err.message})
            return;
          }
        }
        else {
          let message_response = {"message" : "Result not found."}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 212,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("CurrentStatusByPump_",JSON.stringify(Log_Structure))
          res.send(212,message_response)
          return;
		  

        }
      }
      catch(err){
        Log_Structure.response_data = { "message": err.message};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("CurrentStatusByPump_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      }
    
 
}


exports.CurrentValueByPump_v2 = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const pump_id = req.params.pumpid
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

  if(!pump_id ){
    let message_response = { "message": "Incorrect Parameter or Parameter format." }
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 400,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("CurrentValueByPump_",JSON.stringify(Log_Structure))
          res.send(400,message_response)
          return

  }

      try{
          let resultQuery = await Connectdb.query(`
          select * from (
            SELECT rel.pump_id,
               rel.active_hose_number,
               rel.volume,
               rel.value,
               rel.sell_price,
               rel.status,
               rel.notification,
               rel.last_update,
               rel.pending_gauge,
               rel.alarm,
               tran1.trans
              FROM lavender.pumps_real_time rel
                LEFT JOIN ( SELECT transactions.pump_id,
                       json_agg(json_build_object('transaction_id', transactions.transaction_id, 'hose_id', transactions.hose_id, 'completed_ts', to_char(transactions.completed_ts, 'DD/MM/YYYY HH24:MI:SS'::text), 'delivery_type', transactions.delivery_type, 'delivery_volume', to_char(transactions.delivery_volume, 'FM99999999999999999999.990'::text), 'delivery_value', to_char(transactions.delivery_value, 'FM99999999999999999999.990'::text), 'sell_price', to_char(transactions.sell_price, 'FM999.990'::text), 'cleared_by', transactions.cleared_by, 'reserved_by', transactions.reserved_by, 'total_meter_volume', to_char(transactions.total_meter_volume, 'FM99999999999999999999.990'::text), 'total_meter_value', to_char(transactions.total_meter_value, 'FM99999999999999999999.990'::text)) ORDER BY transactions.delivery_type, transactions.transaction_id) AS trans
                      FROM lavender.transactions
                     WHERE transactions.delivery_type = ANY (ARRAY[1, 2])
                     GROUP BY transactions.pump_id) tran1 ON rel.pump_id = tran1.pump_id
             ORDER BY rel.pump_id  ) query_bypump
             where query_bypump.pump_id = ${pump_id}
           `)
        
        if(resultQuery.rowCount > 0){
          try{
          
            let resultResponse = await Promise.all(resultQuery.rows.map(async (data,i)=>{
              let checkSetprice = await Connectdb.query("SELECT * FROM lavender.pump_commands WHERE command = 'set price' and status = false and pump_id = "+data.pump_id+" ORDER BY command_id DESC LIMIT 1")
              
              if(checkSetprice.rowCount !== 0 && (data.status === "Locked" || data.status === "Temp Stopped"))
                data.status = "Price Changing";
              data.status_code = await map_status(data.status);
              //data.event_code = await map_event(data.status);
              //data.event_description = await map_eventDesc(data.status);
              data.last_update =  moment(data.last_update).local().format("D/MM/YYYY HH:mm:ss");
              return Promise.resolve(data);
            }))  
            let message_response = resultResponse
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 200,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("CurrentValueByPump_",JSON.stringify(Log_Structure))
            res.send(200,message_response)
            return;
		
          }
          catch(err){
            Log_Structure.response_data = { "message": err.message};
            Log_Structure.response_StatusCode = 500,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.api_error=true
            ServiceLavender.ServiceLog.WriteLog("CurrentValueByPump_",JSON.stringify(Log_Structure))    
            res.send(500, { "message": err.message})
            return;
          }
        }
        else {
          let message_response = {"message" : "Result not found."}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 212,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("CurrentValueByPump_",JSON.stringify(Log_Structure))
          res.send(212,message_response)
          return;
		  
		 
        }
      }
      catch(err){
        Log_Structure.response_data = { "message": err.message};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("CurrentValueByPump_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
  }
    
 
}



exports.CurrentValue_v2 = async function (req, res, next) {
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
        let resultQuery = await Connectdb.query(` SELECT rel.pump_id,
        rel.active_hose_number,
        rel.volume,
        rel.value,
        rel.sell_price,
        rel.status,
        rel.notification,
        rel.last_update,
        rel.pending_gauge,
        rel.alarm,
        tran1.trans
       FROM lavender.pumps_real_time rel
         LEFT JOIN ( SELECT transactions.pump_id,
                json_agg(json_build_object('transaction_id', transactions.transaction_id, 'hose_id', transactions.hose_id, 'completed_ts', to_char(transactions.completed_ts, 'DD/MM/YYYY HH24:MI:SS'::text), 'delivery_type', transactions.delivery_type, 'delivery_volume', to_char(transactions.delivery_volume, 'FM99999999999999999999.990'::text), 'delivery_value', to_char(transactions.delivery_value, 'FM99999999999999999999.990'::text), 'sell_price', to_char(transactions.sell_price, 'FM999.990'::text), 'cleared_by', transactions.cleared_by, 'reserved_by', transactions.reserved_by, 'total_meter_volume', to_char(transactions.total_meter_volume, 'FM99999999999999999999.990'::text), 'total_meter_value', to_char(transactions.total_meter_value, 'FM99999999999999999999.990'::text)) ORDER BY transactions.delivery_type, transactions.transaction_id) AS trans
               FROM lavender.transactions
              WHERE transactions.delivery_type = ANY (ARRAY[1, 2])
              GROUP BY transactions.pump_id) tran1 ON rel.pump_id = tran1.pump_id
      ORDER BY rel.pump_id`)     

        if(resultQuery.rowCount > 0){
          try{
            let resultResponse = await Promise.all(resultQuery.rows.map(async (data,i)=>{
              let checkSetprice = await Connectdb.query("SELECT * FROM lavender.pump_commands WHERE command = 'set price' and status = false and pump_id = "+data.pump_id+" ORDER BY command_id DESC LIMIT 1")
              if(checkSetprice.rowCount !== 0 && (data.status === "Locked" || data.status === "Temp Stopped"))
                data.status = "Price Changing";
              data.status_code = await map_status(data.status);
              data.last_update =  moment(data.last_update).local().format("DD/MM/YYYY HH:mm:ss");
              return Promise.resolve(data);
            }))  
          let message_response = resultResponse
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 200,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("CurrentValue_",JSON.stringify(Log_Structure))
          res.send(200,message_response)
          }
          catch(err){
            Log_Structure.response_data = { "message": err.message};
            Log_Structure.response_StatusCode = 500,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.api_error=true
            ServiceLavender.ServiceLog.WriteLog("CurrentValue_",JSON.stringify(Log_Structure))    
            res.send(500, { "message": err.message})
            return;
          }
        }
        else {
          let message_response = {"message" : "Result not found."}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 212,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("CurrentValue_",JSON.stringify(Log_Structure))
          res.send(212,message_response)
          return;
        }
      }
      catch(err){
            Log_Structure.response_data = { "message": err.message};
            Log_Structure.response_StatusCode = 500,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.api_error=true
            ServiceLavender.ServiceLog.WriteLog("CurrentValue_",JSON.stringify(Log_Structure))    
            res.send(500, { "message": err.message})
            return;
      }  
}

exports.CurrentValue = async function (req, res, next) {
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
        let resultQuery = await Connectdb.query("select pump_id,active_hose_number,volume,value,sell_price,status,notification,last_update,pending_gauge,alarm from lavender.pumps_real_time order by pump_id")      
        if(resultQuery.rowCount > 0){
          try{
            let resultResponse = await Promise.all(resultQuery.rows.map(async (data,i)=>{
              let checkSetprice = await Connectdb.query("SELECT * FROM lavender.pump_commands WHERE command = 'set price' and status = false and pump_id = "+data.pump_id+" ORDER BY command_id DESC LIMIT 1")
              if(checkSetprice.rowCount !== 0 && (data.status === "Locked" || data.status === "Temp Stopped"))
                data.status = "Price Changing";
              data.status_code = await map_status(data.status);
              data.event_code = await map_event(data.status);
              data.event_description = await map_eventDesc(data.status);
              data.last_update =  moment(data.last_update).local().format("DD/MM/YYYY HH:mm:ss");
              return Promise.resolve(data);
            }))  

          let message_response = resultResponse
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 200,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("CurrentValue_v1_",JSON.stringify(Log_Structure))
          res.send(200,message_response)
          }
          catch(err){
           Log_Structure.response_data = { "message": err.message};
            Log_Structure.response_StatusCode = 500,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.api_error=true
            ServiceLavender.ServiceLog.WriteLog("CurrentValue_v1_",JSON.stringify(Log_Structure))    
            res.send(500, { "message": err.message})
            return;
          }
        }
        else {
          let message_response = {"message" : "Result not found."}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 212,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("CurrentValue_v1_",JSON.stringify(Log_Structure))
          res.send(212,message_response)
          return;
        }
      }
      catch(err){
            Log_Structure.response_data = { "message": err.message};
            Log_Structure.response_StatusCode = 500,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.api_error=true
            ServiceLavender.ServiceLog.WriteLog("CurrentValue_v1_",JSON.stringify(Log_Structure))    
            res.send(500, { "message": err.message})
            return;
      }
    
  
}

exports.CurrentValueByPump = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const pump_id = req.params.pumpid
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
  if(!pump_id ){
    let message_response = { "message": "Incorrect Parameter or Parameter format." }
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 400,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("CurrentValueByPump_v1_",JSON.stringify(Log_Structure))
          res.send(400,message_response)
          return

  }
      try{
     
          let resultQuery = await Connectdb.query("select pump_id,active_hose_number,volume,value,sell_price,status,notification,last_update,pending_gauge,alarm from lavender.pumps_real_time where pump_id = " + pump_id + "")
           
        if(resultQuery.rowCount > 0){
          try{
            let resultResponse = await Promise.all(resultQuery.rows.map(async (data,i)=>{
              let checkSetprice = await Connectdb.query("SELECT * FROM lavender.pump_commands WHERE command = 'set price' and status = false and pump_id = "+data.pump_id+" ORDER BY command_id DESC LIMIT 1")
              if(checkSetprice.rowCount !== 0 && (data.status === "Locked" || data.status === "Temp Stopped"))
                data.status = "Price Changing";
              data.status_code = await map_status(data.status);
              data.event_code = await map_event(data.status);
              data.event_description = await map_eventDesc(data.status);
              data.last_update =  moment(data.last_update).local().format("D/MM/YYYY HH:mm:ss");
              return Promise.resolve(data);
            }))  
            let message_response = resultResponse
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 200,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("CurrentValueByPump_v1_",JSON.stringify(Log_Structure))
            res.send(200,message_response)

          }
          catch(err){
            Log_Structure.response_data = { "message": err.message};
            Log_Structure.response_StatusCode = 500,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.api_error=true
            ServiceLavender.ServiceLog.WriteLog("CurrentValueByPump_v1_",JSON.stringify(Log_Structure))    
            res.send(500, { "message": err.message})
            return;
          }
        }
        else {
          let message_response = {"message" : "Result not found."}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 212,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("CurrentValueByPump_v1_",JSON.stringify(Log_Structure))
          res.send(212,message_response)
          return;
        }
      }
      catch(err){
            Log_Structure.response_data = { "message": err.message};
            Log_Structure.response_StatusCode = 500,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.api_error=true
            ServiceLavender.ServiceLog.WriteLog("CurrentValueByPump_v1_",JSON.stringify(Log_Structure))    
            res.send(500, { "message": err.message})
            return;
      } 
    
 
}

exports.CurrentStatusByPump = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const pump_id = req.params.pumpid
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
  if(!pump_id ){
    let message_response = { "message": "Incorrect Parameter or Parameter format." }
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 400,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("CurrentStatusByPump_v1_",JSON.stringify(Log_Structure))
          res.send(400,message_response)
          return

  }

      try{
        let resultQuery = await Connectdb.query("select pump_id,status,last_update,alarm from lavender.pumps_real_time where  pump_id = " + pump_id + "")
        if(resultQuery.rowCount > 0){
          try{
            let resultResponse = await Promise.all(resultQuery.rows.map(async (data,i)=>{
              let checkSetprice = await Connectdb.query("SELECT * FROM lavender.pump_commands WHERE command = 'set price' and status = false and pump_id = "+data.pump_id+" ORDER BY command_id DESC LIMIT 1")
              if(checkSetprice.rowCount !== 0 && (data.status === "Locked" || data.status === "Temp Stopped"))
              data.status = "Price Changing";
              data.status_code = await map_status(data.status);
              data.event_code = await map_event(data.status);
              data.event_description = await map_eventDesc(data.status);
              data.last_update =  moment(data.last_update).local().format("D/MM/YYYY HH:mm:ss");
              return Promise.resolve(data);
            }))  
            let message_response = resultResponse
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 200,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("CurrentStatusByPump_v1_",JSON.stringify(Log_Structure))
            res.send(200,message_response)
          }
          catch(err){
            Log_Structure.response_data = { "message": err.message};
            Log_Structure.response_StatusCode = 500,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.api_error=true
            ServiceLavender.ServiceLog.WriteLog("CurrentStatusByPump_v1_",JSON.stringify(Log_Structure))    
            res.send(500, { "message": err.message})
            return;
          }
        }
        else {
          let message_response = {"message" : "Result not found."}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 212,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("CurrentStatusByPump_v1_",JSON.stringify(Log_Structure))
          res.send(212,message_response)
          return;
        }
      }
      catch(err){
            Log_Structure.response_data = { "message": err.message};
            Log_Structure.response_StatusCode = 500,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.api_error=true
            ServiceLavender.ServiceLog.WriteLog("CurrentStatusByPump_v1_",JSON.stringify(Log_Structure))    
            res.send(500, { "message": err.message})
            return;
    
      }
 
}

exports.CurrentStatus= async function (req, res, next) {

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
    
        let resultQuery = await Connectdb.query("select pump_id,status,last_update,alarm from lavender.pumps_real_time order by pump_id asc ")  
        if(resultQuery.rowCount > 0){
          try{
            let resultResponse = await Promise.all(resultQuery.rows.map(async (data,i)=>{
              let checkSetprice = await Connectdb.query("SELECT * FROM lavender.pump_commands WHERE command = 'set price' and status = false and pump_id = "+data.pump_id+" ORDER BY command_id DESC LIMIT 1")
              if(checkSetprice.rowCount !== 0 && (data.status === "Locked" || data.status === "Temp Stopped"))
                data.status = "Price Changing";
              data.status_code = await map_status(data.status);
              data.event_code = await map_event(data.status);
              data.event_description = await map_eventDesc(data.status);
              data.last_update =  moment(data.last_update).local().format("D/MM/YYYY HH:mm:ss");
              return Promise.resolve(data);
            }))  
            let message_response = resultResponse
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 200,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("CurrentStatus_v1_",JSON.stringify(Log_Structure))
            res.send(200,message_response)
          }
          catch(err){
            Log_Structure.response_data = { "message": err.message};
            Log_Structure.response_StatusCode = 500,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.api_error=true
            ServiceLavender.ServiceLog.WriteLog("CurrentStatus_v1_",JSON.stringify(Log_Structure))    
            res.send(500, { "message": err.message})
            return;
          }
        }
        else {
          let message_response = {"message" : "Result not found."}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 212,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("CurrentStatus_v1_",JSON.stringify(Log_Structure))
          res.send(212,message_response)
          return;
        }
      }
      catch(err){
        Log_Structure.response_data = { "message": err.message};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("CurrentStatus_v1_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      }
    
  
}
async function map_status(status){
  switch(status){
    case "Idle":                           return 1; break;
    case "Calling":                        return 2; break;
    case "Delivering":                     return 4; break;
    case "Delivery Finished":              return 5; break;
    case "Temp Stopped":                   return 6; break;
    case "Delivery Starting Temp Stopped": return 7; break;
    case "Delivering Temp Stopped":        return 8; break;
    case "Locked":                         return 10;break;
    case "Unknown":                        return 11;break;
    case "Nozzle Left Out":                return 12;break;
    case "Delivery Finishing":             return 15;break;
    case "Delivery Starting":              return 16;break;
    case "Price Changing":                 return 17;break;
    case "Delivery Finishing Temp Stopped": return 18;break;
    default:                               return 99;
  }
}
async function map_event(status){
 // let checkCurrent = await Connectdb.query("SELECT * FROM lavender.pump_transactions WHERE delivery_type = 1")
 // if(checkCurrent > 0)
  //  status = "Delivery Finished";
  switch(status){
    case "Delivering":                     return 4; break;
    case "Delivery Finished":              return 1; break;
    default:                               return 0;
  }
}
async function map_eventDesc(status){
 // let checkCurrent = await Connectdb.query("SELECT * FROM lavender.pump_transactions WHERE delivery_type = 1")
 // if(checkCurrent > 0)
   // status = "Delivery Finished";
  switch(status){
    case "Delivering":                     return "Running_Total"; break;
    case "Delivery Finished":              return "Current_Delivery_Created"; break;
    default:                               return "Status not Map Event";
  }
}
async function map_alarmId(alarm_id, alarm_description) {
    var alarmList = [];
    var desAlarm = alarm_description.split('|');
    if (Number(alarm_id) === 0) return alarmList;
    else {
        let alarmString = Number(alarm_id).toString(2).padStart(16, "0");
        for (let i = 0; i < alarmString.length; i++) {

            if (alarmString[i] === '1')
                alarmList.push({ alarm_id: (16 - i), alarm_description: desAlarm[i] });
        }
        return alarmList;
    }
}

async function getdatetime_now() {
  var datetimenow = new Date();
  var datenow = datetimenow.toISOString().slice(0,10);
  
  var hours = datetimenow.getHours().toString();
  if (hours.length == 1)
  {
	  hours = '0' + hours;
  }
  
  var minutes = datetimenow.getMinutes().toString();
  if (minutes.length == 1)
  {
	  minutes = '0' + minutes;
  }
  
  var seconds = datetimenow.getSeconds().toString();
  if (seconds.length == 1)
  {
	  seconds = '0' + seconds;
  }
  
  var millisec = datetimenow.getMilliseconds().toString();
  if (millisec.length == 1)
  {
	  millisec = '00' + millisec;
  }
  else if (millisec.length == 2)
  {
	  millisec = '0' + millisec;
  }
  
  datetimenow = datenow + 'T' + hours + ':' + minutes + ':' + seconds+ '.' + millisec + 'Z';
  return datetimenow;
}

function rabbitMQPublisher(str, selected_api){
	amqp.connect('amqp://localhost', function(error0, connection) {
		if(error0){
			throw error0;
		}
		connection.createChannel(function(error1, channel) {
			if(error1){
				throw error1;
			}

			var queue = selected_api;
			var msg = str;

			channel.assertQueue(queue, {
				durable: false
			});

			channel.sendToQueue(queue, Buffer.from(msg));
			console.log(" [x] Sent %s", msg);

		});

		setTimeout(function() {
			connection.close();
		}, 1000);
	});
}
