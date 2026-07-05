const config = require('../config')
const Connectdb = config.dbSettings.pool;
const moment = require('moment')
const ServiceLavender = require('../services/index.js')
const _ = require('lodash');

var generator = require('generate-password');

exports.Login = async function (req, res, next) {
  const terminal_id = req.body.terminal_id
  const ip = await req.header('x-forwarded-for') || req.connection.remoteAddress;
  const ip_request = ip.toString().split(":")[3];
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

  if(!terminal_id){
    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("Login_",JSON.stringify(Log_Structure))

    res.send(400,message_response)
    return;
    }
    try {
       let result_release = await Connectdb.query(`update lavender.transactions set reserved_by = null where  reserved_by = ${terminal_id} `);
     
       if (Number(result_release.rowCount) === 0) {
        let passwordapi =  generator.generate({length: 15,numbers: true});
        let loginresualt = await Connectdb.query(`select count(terminal_id) from lavender.user_api  where terminal_id = ${Number(terminal_id)}`); 
          if (Number(loginresualt.rows[0].count) === 0) {
            try {
              let message_response = {"password":passwordapi}
              Log_Structure.response_data = message_response;
              Log_Structure.response_StatusCode = 200,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              ServiceLavender.ServiceLog.WriteLog("Login_",JSON.stringify(Log_Structure))

              await Connectdb.query(`insert into lavender.user_api (terminal_id,password_api,ip_address) VALUES  (${Number(terminal_id)},'${passwordapi}','${ip_request}')`);
              await Connectdb.query(`INSERT INTO lavender.terminals_access_history(terminal_id,access_type,date_time) VALUES(${terminal_id} ,1,NOW())`)
              res.send(200,message_response)
              return;
			  
            } catch (error) {
              Log_Structure.response_data = { "message":error.messaeg};
              Log_Structure.response_StatusCode = 500,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              Log_Structure.api_error=true
              ServiceLavender.ServiceLog.WriteLog("Login_",JSON.stringify(Log_Structure))    
              res.send(500, { "message": error.message})
              return;
	        } 
          }else{

            try {
              let message_response = {"password":passwordapi}
              Log_Structure.response_data = message_response;
              Log_Structure.response_StatusCode = 200,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              ServiceLavender.ServiceLog.WriteLog("Login_",JSON.stringify(Log_Structure))
              
              await Connectdb.query(`update lavender.user_api set password_api = '${passwordapi}',ip_address = '${ip_request}',login_date = NOW() where terminal_id = ${Number(terminal_id)}`);
              res.send(200,message_response)
              return;
			  
            } catch (err) {
              Log_Structure.response_data = { "message":err.messaeg};
              Log_Structure.response_StatusCode = 500,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              Log_Structure.api_error=true
              ServiceLavender.ServiceLog.WriteLog("Login_",JSON.stringify(Log_Structure))    
              res.send(500, { "message": err.message})
              return;
	          }
    }
    }else{
      let message_response =  {"message" : "Incorrect Parameter."}
      Log_Structure.response_data = message_response;
      Log_Structure.response_StatusCode = 400,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      Log_Structure.api_error=false
      ServiceLavender.ServiceLog.WriteLog("Login_",JSON.stringify(Log_Structure))  
      res.send(400, message_response)
      return;
    }
       
    } catch (err) {
        Log_Structure.response_data = { "message":err.messaeg};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("Login_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      }  
    
 
}
exports.Logoff = async function (req, res, next) {
  const terminal_id = req.body.terminal_id;
  const password_api = req.body.password;
  const ip = await req.header('x-forwarded-for') || req.connection.remoteAddress;
  const ip_request = ip.toString().split(":")[3];
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

  if(!terminal_id || !password_api){
    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("Logoff_",JSON.stringify(Log_Structure))

    res.send(400,message_response)
    return;
    }
    try {
      let check_password = await Connectdb.query(`select count(*) from lavender.user_api where terminal_id = ${Number(terminal_id)} and password_api = '${password_api}' and ip_address = '${ip_request}'`);

    
      if (Number(check_password.rows[0].count) === 1) {
  
        await Connectdb.query(`update lavender.transactions set reserved_by = null where  reserved_by = ${Number(terminal_id)}`);
        await Connectdb.query(`delete from  lavender.user_api where terminal_id = ${Number(terminal_id)}`);
        await Connectdb.query(`INSERT INTO lavender.terminals_access_history(terminal_id,access_type,date_time) VALUES(${terminal_id},0,NOW())`)

        let message_response = {"message": "Logoff Completed"}
        Log_Structure.response_data = message_response;
        Log_Structure.response_StatusCode = 200,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        ServiceLavender.ServiceLog.WriteLog("Logoff_",JSON.stringify(Log_Structure))
        res.send(200,message_response)
        return;
		
      }else{
        let message_response =  {"message" : "Incorrect Parameter."}
        Log_Structure.response_data = message_response;
        Log_Structure.response_StatusCode = 400,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=false
        ServiceLavender.ServiceLog.WriteLog("Logoff_",JSON.stringify(Log_Structure))  
        res.send(400, message_response)
        return;
      }
    } catch (error) {
      Log_Structure.response_data = { "message":error.messaeg};
      Log_Structure.response_StatusCode = 500,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      Log_Structure.api_error=true
      ServiceLavender.ServiceLog.WriteLog("Logoff_",JSON.stringify(Log_Structure))    
      res.send(500, { "message": error.message})
      return;
    } 
  

}

