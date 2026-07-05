const config = require('../config')
const Connectdb = config.dbSettings.pool;
const moment = require('moment')
const ServiceLavender = require('../services/index.js')
const _ = require('lodash')
const pm2 = require('pm2')

exports.GetStatusPM2 = async function (req, res, next){
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
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


  try{
    pm2.connect(async function(err) {
      if (err) {
      console.error(err)
      Log_Structure.response_data = { "message": err.message};
      Log_Structure.response_StatusCode = 500,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      Log_Structure.api_error=true
      ServiceLavender.ServiceLog.WriteLog("GetStatusPM2_",JSON.stringify(Log_Structure))
      res.send(500, { "message": err.message})
      return
      }
  
      pm2.list(async (err, list)  => {
        let sub_data = await Promise.all(
          list.map(async (data, i) => {
            let data_pm2 = { "api_name" : data.name,
                             "id": data.pm_id,
                             "status" : data.pm2_env.status,
                             "restart_time" : data.pm2_env.restart_time,
                             "memory": data.monit.memory,
                             "cpu" : data.monit.cpu,
                             //"uptime" :data.pm2_env.pm_uptime
            
            }
            return Promise.resolve(data_pm2);
            
          })
        );
        pm2.disconnect()
        res.send(200, sub_data)
        Log_Structure.response_data = { "message": "Response Data QTY : "+  sub_data.length+ " record" };
        Log_Structure.response_StatusCode = 200,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=false
        ServiceLavender.ServiceLog.WriteLog("GetStatusPM2_",JSON.stringify(Log_Structure))
        return
      })

  })
    }
    catch(err){
      Log_Structure.response_data = { "message": err.message};
      Log_Structure.response_StatusCode = 500,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      Log_Structure.api_error=true
      ServiceLavender.ServiceLog.WriteLog("GetStatusPM2_",JSON.stringify(Log_Structure))
      res.send(500, { "message": err.message})
      return
    }

}



exports.StartStopPM2 = async function (req, res, next){
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const Command = req.body.Command
  const id_api = req.body.id_api
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


  try{
    pm2.connect(async function(err) {
      if (err) {
      console.error(err)
      res.send(500, { "message": err.message})
      return
      }
      if(Command === 'start'){
        pm2.start( id_api.toString() , function(err, apps) {
        if (err) {
          console.error(err)
          Log_Structure.response_data = { "message": err.message};
          Log_Structure.response_StatusCode = 500,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          Log_Structure.api_error=true
          ServiceLavender.ServiceLog.WriteLog("StartStopPM2_",JSON.stringify(Log_Structure))
          res.send(500, { "message": err.message})
          return pm2.disconnect()
        }
        pm2.list(async (err, list)  => {
          let sub_data = await Promise.all(
            list.map(async (data, i) => {
                 let data_pm2 = { "api_name" : data.name,
                               "id": data.pm_id,
                               "status" : data.pm2_env.status,
                               "restart_time" : data.pm2_env.restart_time,
                               "memory": data.monit.memory,
                               "cpu" : data.monit.cpu,
                               //"uptime" :data.pm2_env.pm_uptime
                           
            }
            return Promise.resolve(data_pm2); 
            })
          );
        var find_data = sub_data.filter((item, idx) => { 
            return Number(item.id) === Number(id_api) 
        });
        pm2.disconnect()
        res.send(200,find_data[0] )
        Log_Structure.response_data = find_data[0];
        Log_Structure.response_StatusCode = 200,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=false
        ServiceLavender.ServiceLog.WriteLog("StartStopPM2_",JSON.stringify(Log_Structure))
        return
        })
      })
      }else if(Command === 'stop'){
        pm2.stop( id_api.toString() , function(err, apps) {
          if (err) {
            console.error(err)
            return pm2.disconnect()
          }
          pm2.list(async (err, list)  => {
            let sub_data = await Promise.all(
              pm2.list(async (err, list)  => {
                let sub_data = await Promise.all(
                  list.map(async (data, i) => {
                       let data_pm2 = { "api_name" : data.name,
                                     "id": data.pm_id,
                                     "status" : data.pm2_env.status,
                                     "restart_time" : data.pm2_env.restart_time,
                                     "memory": data.monit.memory,
                                     "cpu" : data.monit.cpu,
                                     //"uptime" :data.pm2_env.pm_uptime
                                 
                  }
                  return Promise.resolve(data_pm2); 
                  })
                );
              var find_data = sub_data.filter((item, idx) => { 
                  return Number(item.id) === Number(id_api) 
              });
              pm2.disconnect()
              res.send(200,find_data[0] )
              Log_Structure.response_data = find_data[0];
              Log_Structure.response_StatusCode = 200,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              Log_Structure.api_error=false
              ServiceLavender.ServiceLog.WriteLog("StartStopPM2_",JSON.stringify(Log_Structure))
              return
              })
            );
          })
        })
      }


  })
    }
    catch(err){
      Log_Structure.response_data = { "message": err.message};
      Log_Structure.response_StatusCode = 500,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      Log_Structure.api_error=true
      ServiceLavender.ServiceLog.WriteLog("StartStopPM2_",JSON.stringify(Log_Structure))
      res.send(500, { "message": err.message})
      return
    }

}