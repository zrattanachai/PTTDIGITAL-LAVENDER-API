const config = require('../config')
const Connectdb = config.dbSettings.pool;
const moment = require('moment')
const ServiceLavender = require('../services/index.js')
const _ = require('lodash');
exports.AuthorizeByPump = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const Pump_id = req.body.pump_id
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
  try {
      try {

        let Check_command_authorize = await Connectdb.query(`select count(command_id) qty_command from lavender.pump_commands where pump_id = ${Pump_id}  and command = 'authorize full' and status = false`);
        if(Check_command_authorize.rows[0].qty_command > 0){
          let message_response = { "message": "Cannot Authorize while Pump ID : "+ Pump_id + " Authorize" }
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 611,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("AuthorizeByPump_",JSON.stringify(Log_Structure))
          await Connectdb.query(`insert into lavender.commands_bk (command,pump_id,create_date) values ('authorize full',${Pump_id},now()) `)
          res.send(611,message_response)
          return
        }
        let Check_Transaction = await Connectdb.query(`SELECT * FROM lavender.transactions WHERE pump_id = ${Pump_id} AND  delivery_type  in(1,2)  `)
        let Delivey_type_1 = Check_Transaction.rows.filter(x => x.delivery_type === 1)
        let Delivey_type_2 = Check_Transaction.rows.filter(x => x.delivery_type === 2)
        if (_.isEmpty(Delivey_type_1) === false) {
          if(Delivey_type_1 !== 0){
            let message_response = { "message": "Cannot Authorize while Pump ID : "+ Pump_id + " has current transaction." }
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 612,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("AuthorizeByPump_",JSON.stringify(Log_Structure))   
            res.send(612,message_response)
            return
          }
        }
      
        let Getdata_pump = await Connectdb.query(`SELECT * FROM lavender.pumps WHERE pump_id = ${Pump_id}`)
       
        if(_.isEmpty(Getdata_pump.rows) === false){
          let Stack_limit = Getdata_pump.rows[0].stack_limit
          if(Delivey_type_2.length >= Stack_limit ){
            let message_response = { "message": " Cannot Authorize while Pump ID : "+Pump_id+" Transaction Stack is limited "}
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 213,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("AuthorizeByPump_",JSON.stringify(Log_Structure))   
            res.send(213,message_response)
            return
          }
        }else{

          let message_response = { "message": "Cannot Read Property Pump ID : "+ Pump_id}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 612,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("AuthorizeByPump_",JSON.stringify(Log_Structure))   
          res.send(612,message_response)
          return
        }
       
        let Check_command_Setprice = await Connectdb.query(`SELECT count(command_id) command_set_prize FROM lavender.pump_commands WHERE command = 'set price' and status = false and pump_id = ${Pump_id}`)
        if(Number(Check_command_Setprice.rows[0].command_set_prize) !== 0 ){
          let message_response = { "message": "Cannot Authorize while Pump "+Pump_id+" is Set Price."}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 613,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("AuthorizeByPump_",JSON.stringify(Log_Structure))   
          res.send(613,message_response)
          return
        }
        let check_Status_Pump = await Connectdb.query(`SELECT * FROM lavender.pumps_real_time WHERE pump_id = ${Pump_id}`)
        if(_.isEmpty(check_Status_Pump) === false)
        {
          if (check_Status_Pump.rows[0].status === 'Locked' || check_Status_Pump.rows[0].status === 'Calling') {
            try {
              await Connectdb.query(`insert into lavender.pump_commands (command,pump_id,create_date) values ('authorize full',${Pump_id},now()) `)
              let message_response = { "message":"Insert command Authorize by Pump ID : " + Pump_id + " is success."}
              Log_Structure.response_data = message_response;
              Log_Structure.response_StatusCode = 200,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              ServiceLavender.ServiceLog.WriteLog("AuthorizeByPump_",JSON.stringify(Log_Structure))   
              res.send(200,message_response)
              return
            } catch (error) {
              let message_response = { "message":"Insert command Authorize by Pump ID : " + Pump_id + "Error :"+error.message}
              Log_Structure.response_data = message_response;
              Log_Structure.response_StatusCode = 500,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              Log_Structure.api_error=true
              ServiceLavender.ServiceLog.WriteLog("AuthorizeByPump_",JSON.stringify(Log_Structure))   
              res.send(500,message_response)
              return
            }
         

          }else{

            let message_response = { "message":"Cannot Authorize  Pump ID : " + Pump_id + " while Status "+check_Status_Pump.rows[0].status}
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 400,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("AuthorizeByPump_",JSON.stringify(Log_Structure))   
            res.send(400,message_response)
            return


          }

        }else{

          let message_response = { "message": "Cannot Read Property Real-Time Pump ID : "+ Pump_id}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 612,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("AuthorizeByPump_",JSON.stringify(Log_Structure))   
          res.send(612,message_response)
          return
        }
      }
      catch (err) {
        Log_Structure.response_data = { "message": err.message};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("AuthorizeByPump_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      }
    
  }
  catch (err) {
  
    Log_Structure.response_data = { "message": err.message};
    Log_Structure.response_StatusCode = 500,
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    Log_Structure.api_error=true
    ServiceLavender.ServiceLog.WriteLog("AuthorizeByPump_",JSON.stringify(Log_Structure))    
    res.send(500, { "message": err.message})
    return;
  }
}

exports.StopByPump = async function (req, res, next) {

  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const Pump_id = req.body.pump_id
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
  try {

      try {
     
        let checkPump = await Connectdb.query(`SELECT * FROM lavender.pumps WHERE pump_id = ${Pump_id}`)
        let checkStatus = await Connectdb.query(`SELECT * FROM lavender.pumps_real_time WHERE pump_id =  ${Pump_id}`)
        let checkCommand = await Connectdb.query(`SELECT * FROM lavender.pump_commands WHERE command = 'stop' and status = false and pump_id =  ${Pump_id} `)
        if (checkPump.rowCount === 1) {
          if(checkStatus.rows[0].status === "Temp Stopped" || checkCommand.rowCount !== 0){
            let message_response = { "message": "The command Stop by Pump ID : " + Pump_id + " is already." }
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 211,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("StopByPump_",JSON.stringify(Log_Structure))   
            res.send(211,message_response);
            return;
          }
          else{
            let ResultStatusInsert = await Connectdb.query(`insert into lavender.pump_commands (command,pump_id,create_date) values ('stop',${Pump_id},now())`)
            if (ResultStatusInsert.rowCount !== 0){
              let message_response = { "message": "Insert command Stop by Pump ID : " + Pump_id + " is success." }
              Log_Structure.response_data = message_response;
              Log_Structure.response_StatusCode = 200,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              ServiceLavender.ServiceLog.WriteLog("StopByPump_",JSON.stringify(Log_Structure))   
              res.send(200, message_response);
              return

            }else{

              let message_response = { "message": "The command Stop by Pump ID : " + Pump_id + " is Error." }
              Log_Structure.response_data = message_response;
              Log_Structure.response_StatusCode = 211,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              ServiceLavender.ServiceLog.WriteLog("StopByPump_",JSON.stringify(Log_Structure))   
              res.send(211,message_response);
              return;
              
			
			}
          }
        }
        else {
          let message_response = { "message": "Can't Read Property Pump ID : " + Pump_id}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 211,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("StopByPump_",JSON.stringify(Log_Structure))   
          res.send(211,message_response);
          return;
        }
      }
      catch (err) {
        Log_Structure.response_data = { "message": err.message};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("StopByPump_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      }
    
  }
  catch (err) {
    Log_Structure.response_data = { "message": err.message};
    Log_Structure.response_StatusCode = 500,
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    Log_Structure.api_error=true
    ServiceLavender.ServiceLog.WriteLog("StopByPump_",JSON.stringify(Log_Structure))    
    res.send(500, { "message": err.message})
    return;
  }
 
}
exports.StartByPump = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const Pump_id = req.body.pump_id
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
  try {
  
      try {
       
        let checkPump = await Connectdb.query(`SELECT * FROM lavender.pumps WHERE pump_id = ${Pump_id}`)
        if (checkPump.rowCount === 1) {
          
        let CheckCommand_StartPump = await Connectdb.query(`select count(command_id) command_resume from lavender.pump_commands where pump_id = ${Pump_id}  and command = 'resume' and status = false`)
          if (Number(CheckCommand_StartPump.rows[0].command_resume) === 0) {
            let Result_Command_StartPump = await Connectdb.query(`insert into lavender.pump_commands (command,pump_id,create_date) values ('resume',${Pump_id},now()) `)
            if (Result_Command_StartPump.rowCount !== 0){
              let message_response = {"message": "Insert command Start by Pump ID : " +Pump_id+ " is success."};
                Log_Structure.response_data = message_response;
                Log_Structure.response_StatusCode = 200,
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                ServiceLavender.ServiceLog.WriteLog("StartByPump_",JSON.stringify(Log_Structure))   
                res.send(200, message_response);
                return      
            }
            else{
              
              let message_response = { "message": "Can't insert command Start by Pump ID : " + Pump_id}
              Log_Structure.response_data = message_response;
              Log_Structure.response_StatusCode = 211,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              ServiceLavender.ServiceLog.WriteLog("StartByPump_",JSON.stringify(Log_Structure))   
              res.send(211,message_response);
              return;
                }
          }else{
            let message_response = { "message": "The command Start by Pump ID : " + Pump_id + " is already." }
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 211,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("StartByPump_",JSON.stringify(Log_Structure))   
            res.send(211,message_response);
            return;
          }
        }
        else {
          let message_response = { "message": "Can't Read Property Pump ID : " + Pump_id}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 211,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("StartByPump_",JSON.stringify(Log_Structure))   
          res.send(211,message_response);
          return;
        
        }
      }
      catch (err) {
        Log_Structure.response_data = { "message": err.message};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("StartByPump_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      }
    
  }
  catch (err) {
    Log_Structure.response_data = { "message": err.message};
    Log_Structure.response_StatusCode = 500,
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    Log_Structure.api_error=true
    ServiceLavender.ServiceLog.WriteLog("StartByPump_",JSON.stringify(Log_Structure))    
    res.send(500, { "message": err.message})
    return;
  }
}

exports.AuthorizeAmtPresetByPump = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const Pump_id = req.body.pump_id
  const Hose_number = req.body.hose_number
  const Value = req.body.value
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
 
  try {
      try {
        let CheckCommand = await Connectdb.query(`select count(command_id) command_authorize from lavender.pump_commands where pump_id = ${Pump_id}  and hose_number = ${Hose_number} and command = 'authorize value' and status = false`)
      
        if(Number(CheckCommand.rows[0].command_authorize) !== 0){
          let message_response = { "message": "Can't Insert command Authorize by Pump ID : " + Pump_id + " Hose Number : " + Hose_number + " Amount : " + Value + " is already"}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 211,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("AuthorizeAmtPresetByPump_",JSON.stringify(Log_Structure))   
          res.send(211, message_response);
          return   
        }
        let checkStack = await Connectdb.query(`SELECT * FROM lavender.transactions WHERE delivery_type = 2 AND pump_id = ${Pump_id}`)
        let checkSetprice = await Connectdb.query(`SELECT * FROM lavender.pump_commands WHERE command = 'set price' and status = false and pump_id = ${Pump_id}`)
        let checkStatus = await Connectdb.query(`SELECT status FROM lavender.pumps_real_time WHERE pump_id = ${Pump_id}`)
        let checkPump = await Connectdb.query(`SELECT * FROM lavender.pumps WHERE pump_id = ${Pump_id}`)
        let checkHose = await Connectdb.query(`SELECT * FROM lavender.hoses WHERE pump_id = ${Pump_id} AND hose_number = ${Hose_number}`)
        let checkTrans = await Connectdb.query(`SELECT * FROM lavender.transactions WHERE pump_id = ${Pump_id} and delivery_type = 1`)
        if (checkTrans.rowCount === 0 && checkPump.rowCount === 1 && checkHose.rowCount === 1 && (checkStatus.rows[0].status=="Locked" ||checkStatus.rows[0].status=="Calling") && checkSetprice.rowCount === 0 && checkStack.rowCount < checkPump.rows[0].stack_limit) {
          let DataResults = await Connectdb.query(`insert into lavender.pump_commands (command,pump_id,hose_number,value,create_date) values ('authorize value',${Pump_id},${Hose_number},${Value},now()) `)
          if (DataResults.rowCount !== 0){
            let message_response = { "message": "Insert command Authorize by Pump ID : " + Pump_id + " Hose Number : " + Hose_number + " Amount : " + Value + " is success." }
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 200,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("AuthorizeAmtPresetByPump_",JSON.stringify(Log_Structure))   
            res.send(200, message_response);
            return   
	
		  }else{
        let message_response = { "message": "Can't Insert command Authorize by Pump ID : " + Pump_id + " Hose Number : " + Hose_number + " Amount : " + Value}
        Log_Structure.response_data = message_response;
        Log_Structure.response_StatusCode = 211,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        ServiceLavender.ServiceLog.WriteLog("AuthorizeAmtPresetByPump_",JSON.stringify(Log_Structure))   
        res.send(211, message_response);
        return   
		  }
        }
        else {
          if (checkTrans.rowCount !== 0){
            let message_response = { "message": "Can't Authorize while Pump has current transaction." }
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 612,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("AuthorizeAmtPresetByPump_",JSON.stringify(Log_Structure))   
            res.send(612, message_response);
            return   
          }else if (checkPump.rowCount !== 1 || checkHose.rowCount !== 1){

            let message_response = { "message": "Can't Read Property Pump ID : "+Pump_id}
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 612,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("AuthorizeAmtPresetByPump_",JSON.stringify(Log_Structure))   
            res.send(612, message_response);
            return   
          }else if (checkStatus.rows[0].status!="Locked" && checkStatus.rows[0].status!="Calling"){
            let message_response = { "message": "Can't  Authorize Pump ID : "+Pump_id+" while "+checkStatus.rows[0].status }
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 611,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("AuthorizeAmtPresetByPump_",JSON.stringify(Log_Structure))   
            res.send(611, message_response);
            return   
          }else if (checkSetprice.rowCount !== 0){
            let message_response = { "message": "Can't  Authorize Pump ID : " + Pump_id + "while Set Price." }
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 613,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("AuthorizeAmtPresetByPump_",JSON.stringify(Log_Structure))   
            res.send(613, message_response);
            return   
          }else if (checkStack.rowCount >= checkPump.rows[0].stack_limit){
            let message_response ={ message: "Cannot Authorize Pump ID : " + Pump_id + "while Transaction Stack is limited." }
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 213,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("AuthorizeAmtPresetByPump_",JSON.stringify(Log_Structure))   
            res.send(213, message_response);
            return   
		  }
        }
      }
      catch (err) {
        Log_Structure.response_data = { "message": err.message};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("AuthorizeAmtPresetByPump_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      }
    
  }
  catch (err) {
    Log_Structure.response_data = { "message": err.message};
    Log_Structure.response_StatusCode = 500,
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    Log_Structure.api_error=true
    ServiceLavender.ServiceLog.WriteLog("AuthorizeAmtPresetByPump_",JSON.stringify(Log_Structure))    
    res.send(500, { "message": err.message})
    return;
  }
}

exports.AuthorizeVolPresetByPump = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const Pump_id = req.body.pump_id
  const Hose_number = req.body.hose_number
  const Value = req.body.value
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
  try {
      try {

        let CheckCommand = await Connectdb.query(`select count(command_id) command_authorize from lavender.pump_commands where pump_id = ${Pump_id}  and hose_number = ${Hose_number} and command = 'authorize volume' and status = false`)
      
        if(Number(CheckCommand.rows[0].command_authorize) !== 0){
          let message_response = { "message": "Can't Insert command Authorize Volume  by Pump ID : " + Pump_id + " Hose Number : " + Hose_number + " Amount : " + Value + " is already"}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 211,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("AuthorizeVolPresetByPump_",JSON.stringify(Log_Structure))   
          res.send(211, message_response);
          return   
        }
      
        let checkStack = await Connectdb.query(`SELECT * FROM lavender.transactions WHERE delivery_type = 2 AND pump_id = ${Pump_id}`)
        let checkSetprice = await Connectdb.query(`SELECT * FROM lavender.pump_commands WHERE command = 'set price' and status = false and pump_id = ${Pump_id}`)
        let checkStatus = await Connectdb.query(`SELECT status FROM lavender.pumps_real_time WHERE pump_id = ${Pump_id}`)
        let checkPump = await Connectdb.query(`SELECT * FROM lavender.pumps WHERE pump_id = ${Pump_id}`)
        let checkHose = await Connectdb.query(`SELECT * FROM lavender.hoses WHERE pump_id = ${Pump_id} AND hose_number = ${Hose_number}`)
        let checkTrans = await Connectdb.query(`SELECT * FROM lavender.transactions WHERE pump_id = ${Pump_id} and delivery_type = 1`)
        if (checkTrans.rowCount === 0 && checkPump.rowCount === 1 && checkHose.rowCount === 1 && (checkStatus.rows[0].status=="Locked" ||checkStatus.rows[0].status=="Calling") && checkSetprice.rowCount === 0 && checkStack.rowCount < checkPump.rows[0].stack_limit) {
          let DataResultsInsert_Command = await Connectdb.query("insert into lavender.pump_commands (command,pump_id,hose_number,value,create_date) values ('authorize volume'," + req.body.pump_id + "," + req.body.hose_number + "," + req.body.value + ",now()) ")
          if (DataResultsInsert_Command.rowCount !== 0){

                let message_response = { "message": "Insert command Authorize by Pump ID : " + Pump_id + " Hose Number : " + Hose_number+ " Volume : " + Value + " is success." }
                Log_Structure.response_data = message_response;
                Log_Structure.response_StatusCode = 200,
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                ServiceLavender.ServiceLog.WriteLog("AuthorizeVolPresetByPump_",JSON.stringify(Log_Structure))   
                res.send(200, message_response);
		      }
          else
          {
                let message_response = { "message": "Can't Insert command Authorize by Pump ID : " + Pump_id + " Hose Number : " + Hose_number + " Amount : " + Value}
                Log_Structure.response_data = message_response;
                Log_Structure.response_StatusCode = 211,
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                ServiceLavender.ServiceLog.WriteLog("AuthorizeVolPresetByPump_",JSON.stringify(Log_Structure))   
                res.send(211, message_response);
                return   
            
          }
        }
        else {
          if (checkTrans.rowCount !== 0){
            let message_response =  { "message": "Cannot Authorize while Pump has current transaction." }
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 612,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("AuthorizeVolPresetByPump_",JSON.stringify(Log_Structure))   
            res.send(612, message_response);
            return   
          }else if (checkPump.rowCount !== 1 || checkHose.rowCount !== 1){
            let message_response = { "message": "Can't Read Property Pump ID : "+Pump_id}
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 400,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("AuthorizeVolPresetByPump_",JSON.stringify(Log_Structure))   
            res.send(400, message_response);
            return;
          }else if (checkStatus.rows[0].statusb !="Locked" && checkStatus.rows[0].status != "Calling"){

            let message_response = { "message": "Cannot Authorize Pump ID : " + Pump_id + " while "+checkStatus.rows[0].status }
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 611,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("AuthorizeVolPresetByPump_",JSON.stringify(Log_Structure))   
            res.send(611, message_response);
            return;
          }else if (checkSetprice.rowCount !== 0){
            let message_response = { "message": "Cannot Authorize while Pump Set Price." }
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 613,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("AuthorizeVolPresetByPump_",JSON.stringify(Log_Structure))   
            res.send(613, message_response);
            return;
          }else if (checkStack.rowCount >= checkPump.rows[0].stack_limit){
            let message_response = { "message": "Cannot Authorize while Pump Set Price." }
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 213,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("AuthorizeVolPresetByPump_",JSON.stringify(Log_Structure))   
            res.send(213, message_response);
            return;
		  }
        }
    }
      catch (err) {
        Log_Structure.response_data = { "message": err.message};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("AuthorizeVolPresetByPump_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      }
    
  }
  catch (err) {
    Log_Structure.response_data = { "message": err.message};
    Log_Structure.response_StatusCode = 500,
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    Log_Structure.api_error=true
    ServiceLavender.ServiceLog.WriteLog("AuthorizeVolPresetByPump_",JSON.stringify(Log_Structure))    
    res.send(500, { "message": err.message})
    return;
  }
}
exports.StopPump = async function (req, res, next) {
  
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

  try {
      let DataResults_All_Pump = await Connectdb.query("select pump_id from lavender.pumps")
      let validate_status_command_stop = false
      let Pump_id_Error = []
      let Pump_id_Success = []
      try {
      await Promise.all(DataResults_All_Pump.rows.map(async (data, i) => {
      try {
            let checkStatus = await Connectdb.query("SELECT * FROM lavender.pumps_real_time WHERE pump_id = "+data.pump_id+"")
            let checkCommand = await Connectdb.query("SELECT * FROM lavender.pump_commands WHERE command = 'stop' and status = false and pump_id = " + data.pump_id + "")
            if(checkStatus.rows[0].status != "Temp Stopped" && checkCommand.rowCount == 0)
          {
            let Status_insert =  await Connectdb.query("insert into lavender.pump_commands (command,pump_id,create_date) values ('stop'," + data.pump_id + ",now())")
            if(Status_insert.rowCount != 0){ 
            Pump_id_Success.push(data.pump_id)
            let message_response = { "message": "Insert the command ALL Pump Stop "+data.pump_id+ " is success" }
              Log_Structure.response_data = message_response;
              Log_Structure.response_StatusCode = 200,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              ServiceLavender.ServiceLog.WriteLog("StopPump_",JSON.stringify(Log_Structure))   
            }else{
              validate_status_command_stop = true;
              Pump_id_Error.push(data.pump_id)
              let message_response = { "message": "Can't Insert the command ALL Pump Stop "+data.pump_id+ " is error" }
              Log_Structure.response_data = message_response;
              Log_Structure.response_StatusCode = 400,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              ServiceLavender.ServiceLog.WriteLog("StopPump_",JSON.stringify(Log_Structure)) 
            }
			    }
          }
        catch (error) 
          {
            validate_status_command_stop = true;
              Pump_id_Error.push(data.pump_id)
              let message_response = { "message": "Can't Insert the command ALL Pump Stop "+data.pump_id+ " is error" + error.messaeg }
              Log_Structure.response_data = message_response;
              Log_Structure.response_StatusCode = 400,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              ServiceLavender.ServiceLog.WriteLog("StopPump_",JSON.stringify(Log_Structure)) 
          }
        }))

        if (validate_status_command_stop === false){
          let message_response = { "message": "Insert command Stop all Pump "+Pump_id_Success+" is success." }
          Log_Structure.response_data = message_response;
              Log_Structure.response_StatusCode = 200,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              ServiceLavender.ServiceLog.WriteLog("StopPump_",JSON.stringify(Log_Structure)) 
              res.send(200,message_response)
              return
        }else{
          let message_response = { "message": "Can't Insert command Stop all Pump " +Pump_id_Error + "is not success."}
          Log_Structure.response_data = message_response;
              Log_Structure.response_StatusCode = 400,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              ServiceLavender.ServiceLog.WriteLog("StopPump_",JSON.stringify(Log_Structure)) 
              res.send(400,message_response)
              return
		}
      }
      catch (err) {
        Log_Structure.response_data = { "message": err.message};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("StopPump_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      }
    
  }
  catch (err) {
    Log_Structure.response_data = { "message": err.message};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("StopPump_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
  }
  
}

exports.StartPump = async function (req, res, next) {
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
  try {
    
    let validate_status_command_start = false
    let Pump_id_Error = []
    let Pump_id_Success = []
      let DataResults_statu_all_pump = await Connectdb.query("select pump_id from lavender.pumps")
      try {
       await  Promise.all(DataResults_statu_all_pump.rows.map(async (data, i) => {
          try {
            let Status_insert =  await Connectdb.query("insert into lavender.pump_commands (command,pump_id,create_date) values ('resume'," + data.pump_id + ",now())")
            if (Status_insert.rowCount !== 0) {
              Pump_id_Success.push(data.pump_id)
              let message_response = { "message": "Insert the command ALL Pump Stop "+data.pump_id+ " is success" }
                Log_Structure.response_data = message_response;
                Log_Structure.response_StatusCode = 200,
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                ServiceLavender.ServiceLog.WriteLog("StartPump_",JSON.stringify(Log_Structure))   
              }else{
                validate_status_command_start = true;
                Pump_id_Error.push(data.pump_id)
                let message_response = { "message": "Can't Insert the command ALL Pump Stop "+data.pump_id+ " is error" }
                Log_Structure.response_data = message_response;
                Log_Structure.response_StatusCode = 400,
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                ServiceLavender.ServiceLog.WriteLog("StartPump_",JSON.stringify(Log_Structure)) 
              }
          }
          catch (error) 
          {
            validate_status_command_start = true;
            Pump_id_Error.push(data.pump_id)
            let message_response = { "message": "Can't Insert the command ALL Pump Stop "+data.pump_id+ " is error" + error.messaeg }
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 400,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("StartPump_",JSON.stringify(Log_Structure)) 
           
          }

        }))

    
        if (validate_status_command_start === false)
        {
              let message_response = { "message": "Insert command Start all Pump "+Pump_id_Success+" is success." }
              Log_Structure.response_data = message_response;
              Log_Structure.response_StatusCode = 200,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              ServiceLavender.ServiceLog.WriteLog("StartPump_",JSON.stringify(Log_Structure)) 
              res.send(200,message_response)
              return
        }
        else
        {
              let message_response = { "message": "Can't Insert command Start all Pump " +Pump_id_Error + "is not success."}
              Log_Structure.response_data = message_response;
              Log_Structure.response_StatusCode = 400,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              ServiceLavender.ServiceLog.WriteLog("StartPump_",JSON.stringify(Log_Structure)) 
              res.send(400,message_response)
              return
		    }
      }
      catch (err) {
        Log_Structure.response_data = { "message": err.message};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("StartPump_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      }
  }
  catch (err) {
    Log_Structure.response_data = { "message": err.message};
    Log_Structure.response_StatusCode = 500,
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    Log_Structure.api_error=true
    ServiceLavender.ServiceLog.WriteLog("StartPump_",JSON.stringify(Log_Structure))    
    res.send(500, { "message": err.message})
    return;
  }
}
exports.CancelAuthorizeByPump = async function (req, res, next) {

  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const Pump_id = req.body.pump_id
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
  try {
      try {
     
        let checkPump = await Connectdb.query(`SELECT * FROM lavender.pumps WHERE pump_id = ${Pump_id}`)
        
        if (checkPump.rowCount == 1) {
          let checkAuthorize = await Connectdb.query("SELECT * FROM lavender.pump_commands"
                                                  + " WHERE command='authorize full' AND status=false AND pump_id=" + Pump_id + ""
                                                  + " ORDER BY command_id"
                                                  + " LIMIT 1 ")
          let checkStatus = await Connectdb.query(`SELECT status FROM lavender.pumps_real_time WHERE pump_id = ${Pump_id} and status = 'Idle'`)
          
          if(checkStatus.rowCount !== 0){
            if (checkAuthorize.rowCount !== 0) {
             await Connectdb.query("UPDATE lavender.pump_commands"
                                                    + " SET status = true WHERE command_id = " + checkAuthorize.rows[0].command_id + "")
            }
            let DataResults = await Connectdb.query("insert into lavender.pump_commands (command,pump_id,create_date) values ('stop'," + req.body.pump_id + ",now())")
            if (DataResults.rowCount !== 0){
              let message_response = { "messaeg": "Insert command Cancel Authorize by Pump ID : " + Pump_id+ " is success." }
              Log_Structure.response_data = message_response;
              Log_Structure.response_StatusCode = 200,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              ServiceLavender.ServiceLog.WriteLog("CancelAuthorizeByPump_",JSON.stringify(Log_Structure)) 
              res.send(200,message_response)
              return
              
            }else
            {
              let message_response = { "messaeg": "Can't Insert command Cancel Authorize by Pump ID : " + Pump_id+ " is fail." }
              Log_Structure.response_data = message_response;
              Log_Structure.response_StatusCode = 211,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              ServiceLavender.ServiceLog.WriteLog("CancelAuthorizeByPump_",JSON.stringify(Log_Structure)) 
              res.send(211,message_response)
              return
              
			      }
          }
          else{
            let message_response = { "messaeg": "Can't abort command Cancel Authorize by Pump ID : " + Pump_id+ " is fail." }
              Log_Structure.response_data = message_response;
              Log_Structure.response_StatusCode = 614,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              ServiceLavender.ServiceLog.WriteLog("CancelAuthorizeByPump_",JSON.stringify(Log_Structure)) 
              res.send(614,message_response)
              return
          }
          
        }
        else {
          let message_response = { "messaeg": "Can't Read Property Pump ID : " + Pump_id}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 400,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("CancelAuthorizeByPump_",JSON.stringify(Log_Structure)) 
          res.send(400,message_response)
          return
        }
      }
      catch (err) {
        Log_Structure.response_data = { "message": err.message};
          Log_Structure.response_StatusCode = 500,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          Log_Structure.api_error=true
          ServiceLavender.ServiceLog.WriteLog("CancelAuthorizeByPump_",JSON.stringify(Log_Structure))    
          res.send(500, { "message": err.message})
          return;
      }
    
  }
  catch (err) {
          Log_Structure.response_data = { "message": err.message};
          Log_Structure.response_StatusCode = 500,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          Log_Structure.api_error=true
          ServiceLavender.ServiceLog.WriteLog("CancelAuthorizeByPump_",JSON.stringify(Log_Structure))    
          res.send(500, { "message": err.message})
          return;
  }
 
}
// async function check(terminal_id, password_api, ip) {
//   try {
//     let check_password = await Connectdb.query("select count(*) from lavender.user_api where terminal_id = " + Number(terminal_id) + " and password_api = '" + password_api + "' and ip_address = '" + ip + "'");

//     if (check_password.rows[0].count > 0) {
//       return true
//     } else {
//       return false
//     }
//   }
//   catch (err) {
//     console.error("Request: " + req.body);
//     console.error("Error: " + err);
//     res.send(500, { "message": err.messaeg })
//   }

// }
// async function check_ip(req) {

//   let ip = await req.header('x-forwarded-for') || req.connection.remoteAddress;
//   let ip_client = ip.toString().split(":");
//   return ip_client[3];
// }

// async function getdatetime_now() {
//   var datetimenow = new Date();
//   var datenow = datetimenow.toISOString().slice(0,10);
  
//   var hours = datetimenow.getHours().toString();
//   if (hours.length == 1)
//   {
// 	  hours = '0' + hours;
//   }
  
//   var minutes = datetimenow.getMinutes().toString();
//   if (minutes.length == 1)
//   {
// 	  minutes = '0' + minutes;
//   }
  
//   var seconds = datetimenow.getSeconds().toString();
//   if (seconds.length == 1)
//   {
// 	  seconds = '0' + seconds;
//   }
  
//   var millisec = datetimenow.getMilliseconds().toString();
//   if (millisec.length == 1)
//   {
// 	  millisec = '00' + millisec;
//   }
//   else if (millisec.length == 2)
//   {
// 	  millisec = '0' + millisec;
//   }
  
//   datetimenow = datenow + 'T' + hours + ':' + minutes + ':' + seconds+ '.' + millisec + 'Z';
//   return datetimenow;
// }

// function rabbitMQPublisher(str, selected_api){
// 	amqp.connect('amqp://localhost', function(error0, connection) {
// 		if(error0){
// 			throw error0;
// 		}
// 		connection.createChannel(function(error1, channel) {
// 			if(error1){
// 				throw error1;
// 			}

// 			var queue = selected_api;
// 			var msg = str;

// 			channel.assertQueue(queue, {
// 				durable: false
// 			});

// 			channel.sendToQueue(queue, Buffer.from(msg));
// 			console.log(" [x] Sent %s", msg);

// 		});

// 		setTimeout(function() {
// 			connection.close();
// 		}, 1000);
// 	});
// }