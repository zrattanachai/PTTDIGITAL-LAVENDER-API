const config = require('../config')
const ServiceLavender = require('../services/index.js')
const Connectdb = config.dbSettings.pool;
const moment = require('moment')
const auth = require('basic-auth')
//var amqp = require('amqplib/callback_api');
// PATCH /gaia_stations/tank_inventory

exports.Gradeall = async function (req, res, next) {
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
        let resultQuery = await Connectdb.query("SELECT g.grade_id, g.grade_name, g.grade_number, p.price_level_1, p.price_level_2 FROM lavender.grades AS g"
                                              + " INNER JOIN lavender.price_profiles AS p ON g.price_profile_id = p.profile_id")
        if (resultQuery.rowCount > 0) {
          let message_response = resultQuery.rows
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 200,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("Gradeall_",JSON.stringify(Log_Structure))
          res.send(200,message_response)
          return;
        }
        else {
          let message_response = {"message" : "Result not found."}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 212,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("Gradeall_",JSON.stringify(Log_Structure))
          res.send(212,message_response)
          return;
		}
      }
      catch (err) {
        Log_Structure.response_data = { "message": err.message};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("Gradeall_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      }
    
  
}
exports.GradeByPumpID = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const pumpid = req.params.pumpid;
  const hosenumber = req.params.hosenumber;
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
        if(!pumpid || !hosenumber ){
          let message_response = { "message": "Incorrect Parameter or Parameter format." }
                Log_Structure.response_data = message_response;
                Log_Structure.response_StatusCode = 400,
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                ServiceLavender.ServiceLog.WriteLog("GradeByPumpID_",JSON.stringify(Log_Structure))
                res.send(400,message_response)
                return
      
        }

        let resultQuery = await Connectdb.query("SELECT h.pump_id, h.hose_number, g.grade_id, g.grade_name, g.grade_number, p.price_level_1, p.price_level_2 FROM lavender.grades AS g"
                                              + " INNER JOIN lavender.price_profiles AS p ON g.price_profile_id = p.profile_id"
                                              + " INNER JOIN lavender.hoses AS h ON g.grade_id = h.grade_id"
                                              + " WHERE h.pump_id = " + pumpid + " AND h.hose_number = " + hosenumber + ""
                                              + " ORDER BY g.grade_id")

        if (resultQuery.rowCount > 0) {
            let message_response = resultQuery.rows
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 200,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("GradeByPumpID_",JSON.stringify(Log_Structure))
            res.send(200,message_response)
            return;
        }
        else{
          let message_response = {"message" : "Result not found."}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 212,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("GradeByPumpID_",JSON.stringify(Log_Structure))
          res.send(212,message_response)
          return;
		}
      }
      catch (err) {
        Log_Structure.response_data = { "message": err.message};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("GradeByPumpID_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      }
    
  
}
exports.SetGradeByPump = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const gradename = req.body.gradename;
  const pumpid = req.body.pumpid;
  const hosenumber = req.body.hosenumber;
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
        if(!gradename || !pumpid  || !hosenumber){
          let message_response = { "message": "Incorrect Parameter or Parameter format." }
                Log_Structure.response_data = message_response;
                Log_Structure.response_StatusCode = 400,
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                ServiceLavender.ServiceLog.WriteLog("SetGradeByPump_",JSON.stringify(Log_Structure))
                res.send(400,message_response)
                return
      
        }

        let resultQuery = await Connectdb.query("SELECT * FROM lavender.grades INNER JOIN lavender.price_profiles ON grades.price_profile_id = price_profiles.profile_id " +
          "WHERE price_profiles.enable = true AND grades.grade_name = '" + gradename + "'")
        if (resultQuery.rowCount !== 0) {
          let resultQuery2 = await Connectdb.query("UPDATE lavender.hoses SET grade_id = (SELECT grades.grade_id FROM lavender.grades WHERE grades.grade_name = '" + gradename + "')" +
            ",price_profile_id = (SELECT grades.price_profile_id FROM lavender.grades WHERE grades.grade_name = '" + gradename + "')" +
            "FROM lavender.grades INNER JOIN lavender.price_profiles ON price_profiles.profile_id = grades.price_profile_id " +
            "WHERE price_profiles.enable = true and hoses.pump_id=" + pumpid + " AND hoses.hose_number=" + hosenumber + "")

          if (resultQuery2.rowCount > 0){
            let message_response = { "message": "Changed gradename : " + gradename + " is success, please restart Lavender-dispenser.service" }
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 200,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("SetGradeByPump_",JSON.stringify(Log_Structure))
            ServiceLavender.ServiceBackUp.BackupData([{ tableName : "hoses", pump_id : pumpid, hose_number :hosenumber},])        
            res.send(200,message_response)
            return;
            
          }else{
          let message_response = { "message": "Can't Changed gradename : " + gradename}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 211,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("SetGradeByPump_",JSON.stringify(Log_Structure))
          res.send(211,message_response)
          return;
		  }
        }
        else {
          let message_response = { "message": "Can't Find gradename : " + gradename + " in Lavender box"}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 400,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("SetGradeByPump_",JSON.stringify(Log_Structure))
          res.send(400,message_response)
          return;
        }
      }
      catch (err) {
        Log_Structure.response_data = { "message": err.message};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("SetGradeByPump_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      }
    

}
exports.SetGrade = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const gradename = req.body.gradename;
  const pricelevel1 = req.body.pricelevel1;
  const pricelevel2 = req.body.pricelevel2;
  const Log_Structure = {
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

          if(!gradename || !pricelevel1  || !pricelevel2){
            let message_response = { "message": "Incorrect Parameter or Parameter format." }
                  Log_Structure.response_data = message_response;
                  Log_Structure.response_StatusCode = 400,
                  Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                  ServiceLavender.ServiceLog.WriteLog("SetGrade_",JSON.stringify(Log_Structure))
                  res.send(400,message_response)
                  return
        
          }

          let priceprofile = await Connectdb.query("INSERT INTO lavender.price_profiles (profile_name,price_level_1,price_level_2) VALUES ('" + gradename + "'," + pricelevel1 + "," + pricelevel2 + ")")
          if (priceprofile.rowCount !== 0) {
            let resultQuery = await Connectdb.query("SELECT profile_id FROM lavender.price_profiles WHERE profile_name = '" + gradename + "'")
            let getNumber = await Connectdb.query("SELECT grade_number FROM lavender.grades ORDER BY grade_number DESC LIMIT 1")

            if (resultQuery.rowCount !== 0) 
            {
              let resultQuery2 = await Connectdb.query("INSERT INTO lavender.grades (grade_name,grade_number,price_profile_id) " +
                "VALUES ('" + gradename + "'," + (Number(getNumber.rows[0].grade_number) + Number(1)) + "," + resultQuery.rows[0].profile_id + ")")
                      if (resultQuery2.rowCount === 1){
                        let message_response = { "message": "Changed gradename : " + gradename + " is success, please restart Lavender-dispenser.service" }
                        Log_Structure.response_data = message_response;
                        Log_Structure.response_StatusCode = 200,
                        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                        ServiceLavender.ServiceLog.WriteLog("SetGrade_",JSON.stringify(Log_Structure))
                        ServiceLavender.ServiceBackUp.BackupData([{ tableName : "grades", grade_name : gradename},
                                                                  { tableName : "price_profiles", profile_name : gradename},])
                        res.send(200,message_response)
                        return;
                      }else{
                        let message_response = { "message": "Can't Set  Profile  gradename : " + gradename}
                        Log_Structure.response_data = message_response;
                        Log_Structure.response_StatusCode = 211,
                        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                        ServiceLavender.ServiceLog.WriteLog("SetGrade_",JSON.stringify(Log_Structure))
                        res.send(211,message_response)
                        return;
                    }
            }
            else{
              let message_response = { "message": "Can't Find Profile  gradename : " + gradename}
              Log_Structure.response_data = message_response;
              Log_Structure.response_StatusCode = 400,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              ServiceLavender.ServiceLog.WriteLog("SetGrade_",JSON.stringify(Log_Structure))
              res.send(400,message_response)
              return;
      			}
          }
          else {
            let message_response =  { "message": "Can't Set Price gradename : " + gradename + " in Lavender box"}
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 400,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("SetGrade_",JSON.stringify(Log_Structure))
            res.send(400,message_response)
            return;
          }
        }
        catch (err) {
          Log_Structure.response_data = { "message": err.message};
          Log_Structure.response_StatusCode = 500,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          Log_Structure.api_error=true
          ServiceLavender.ServiceLog.WriteLog("SetGrade_",JSON.stringify(Log_Structure))    
          res.send(500, { "message": err.message})
          return;
        }
    
    
  
}
exports.DeleteGrade = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const gradename = req.body.gradename;
  const Log_Structure = {
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
        if(!gradename){
          let message_response = { "message": "Incorrect Parameter or Parameter format." }
                Log_Structure.response_data = message_response;
                Log_Structure.response_StatusCode = 400,
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                ServiceLavender.ServiceLog.WriteLog("DeleteGrade_",JSON.stringify(Log_Structure))
                res.send(400,message_response)
                return
      
        }
        let resultQuery = await Connectdb.query("UPDATE lavender.price_profiles SET enable = false WHERE profile_name = '" + gradename + "'")
        if (resultQuery.rowCount === 1){
          let message_response = { "message": "Deleted gradename : " + gradename + " is success, please restart Lavender-dispenser.service" }
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 200,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("DeleteGrade_",JSON.stringify(Log_Structure))
          ServiceLavender.ServiceBackUp.BackupData([{ tableName : "price_profiles", profile_name : gradename},])
          res.send(200,message_response)
          return;
        }else {
          let message_response = { "message": "Fail To Deleted gradename : " + gradename}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 211,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("DeleteGrade_",JSON.stringify(Log_Structure))
          res.send(211,message_response)
		}
      }
      catch (err) {
        Log_Structure.response_data = { "message": err.message};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("DeleteGrade_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      }
}

exports.ChangeGrade = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const grade_id = req.body.grade_id;
  const tank_id = req.body.tank_id;
  const Log_Structure = {
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
          if(!grade_id || !tank_id){
            let message_response = { "message": "Incorrect Parameter or Parameter format." }
                  Log_Structure.response_data = message_response;
                  Log_Structure.response_StatusCode = 400,
                  Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                  ServiceLavender.ServiceLog.WriteLog("ChangeGrade_v1_",JSON.stringify(Log_Structure))
                  res.send(400,message_response)
                  return
        
          }

          let getTank = await Connectdb.query("SELECT * FROM lavender.tanks where tank_id = " + tank_id)
          let getGrade = await Connectdb.query("SELECT * FROM lavender.grades where grade_id = " + grade_id)
          if (getGrade.rowCount !== 0 && getTank !== 0) {
              let changeGrade = await Connectdb.query("UPDATE lavender.tanks SET grade_id = " + grade_id + ", tank_name = 'T" + tank_id + "-" + getGrade.rows[0].grade_name + "', tank_description = 'T" + tank_id + "-" + getGrade.rows[0].grade_name+ "', physical_label = 'T" + tank_id + "-" + getGrade.rows[0].grade_name + "' WHERE tank_id = " + tank_id)
              let changeHose = await Connectdb.query("UPDATE lavender.hoses SET grade_id = " + grade_id +", price_profile_id = " + getGrade.rows[0].price_profile_id + ", tank_id = " + tank_id + " WHERE tank_id = " + tank_id)
              if (changeGrade.rowCount === 1 && changeHose.rowCount > 0){
                let message_response = { "message": "Changed grade : " + getGrade.rows[0].grade_name + " is success, please restart Lavender-dispenser.service" }
                Log_Structure.response_data = message_response;
                Log_Structure.response_StatusCode = 200,
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                ServiceLavender.ServiceLog.WriteLog("ChangeGrade_v1_",JSON.stringify(Log_Structure))
                res.send(200,message_response)
                return;
              }else{
                let message_response = { "message": "Can't update Tank Profile ID : "+tank_id+" Or Grade Profile ID : "+grade_id+" In lavender Box"}
                Log_Structure.response_data = message_response;
                Log_Structure.response_StatusCode = 211,
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                ServiceLavender.ServiceLog.WriteLog("ChangeGrade_v1_",JSON.stringify(Log_Structure))
                res.send(211,message_response)
                return;
              }
          }
          else {
            let message_response = { "message": "Can't Get Tank Profile ID : "+tank_id+" Or Grade Profile ID : "+grade_id+" In lavender Box"}
                Log_Structure.response_data = message_response;
                Log_Structure.response_StatusCode = 400,
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                ServiceLavender.ServiceLog.WriteLog("ChangeGrade_v1_",JSON.stringify(Log_Structure))
                res.send(400,message_response)
                return;
          }
        }
        catch (err) {
          Log_Structure.response_data = { "message": err.message};
          Log_Structure.response_StatusCode = 500,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          Log_Structure.api_error=true
          ServiceLavender.ServiceLog.WriteLog("ChangeGrade_v1_",JSON.stringify(Log_Structure))    
          res.send(500, { "message": err.message})
          return;
        }
}

exports.ChangeGrade_v2 = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const grade_id = req.body.grade_id;
  const grade_name = req.body.grade_name;
  const mat_id = req.body.mat_id;
  const pricelevel1 = req.body.pricelevel1;
  const pricelevel2 = req.body.pricelevel2;
  const tank_id = req.body.tank_id;
  const Log_Structure = {
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
          if(!grade_id || !grade_name || !mat_id || !pricelevel1  || !pricelevel2 || !tank_id){
            let message_response = { "message": "Incorrect Parameter or Parameter format." }
                  Log_Structure.response_data = message_response;
                  Log_Structure.response_StatusCode = 400,
                  Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                  ServiceLavender.ServiceLog.WriteLog("ChangeGrade_",JSON.stringify(Log_Structure))
                  res.send(400,message_response)
                  return
        
          }
          let queryGrade = null
          let getGrade = await Connectdb.query("SELECT * FROM lavender.grades where grade_id = " + grade_id)
          if(getGrade.rowCount === 1){
            queryGrade = {
              text: "UPDATE lavender.grades SET grade_name = $1, grade_number = $2, price_profile_id = $3 WHERE grade_id = " + grade_id,
              values: [grade_name, grade_id, grade_id]
            };
          }
          else{
            queryGrade = {
              text: "INSERT INTO lavender.grades (grade_id, grade_name, grade_number, price_profile_id) VALUES ($1, $2, $3, $4);",
              values: [grade_id, grade_name, grade_id, grade_id]
            };
          }

          var queryPrice = null
          let getPrice = await Connectdb.query("SELECT * FROM lavender.price_profiles where profile_id = " + grade_id)
          if(getPrice.rowCount === 1){
            queryPrice = {
              text: "UPDATE lavender.price_profiles SET profile_name = $1, price_level_1 = $2, price_level_2 = $3, enable = true, material_id = $4, date_update = now() WHERE profile_id = " + grade_id,
              values: [grade_name, pricelevel1, pricelevel2, mat_id]
            };
          }
          else{
            queryPrice = {
              text: "INSERT INTO lavender.price_profiles (profile_id, profile_name, price_level_1, price_level_2, enable, material_id, date_update) VALUES ($1, $2, $3, $4, true, $5, now());",
              values: [grade_id, grade_name, pricelevel1, pricelevel2, mat_id]
            };
          }
          
          
          let setGrade = await Connectdb.query(queryGrade)
          let setPrice = await Connectdb.query(queryPrice)
          if(setGrade.rowCount === 1 && setPrice.rowCount === 1 && tank_id > 0){
            let getTank = await Connectdb.query("SELECT * FROM lavender.tanks where tank_id = " + tank_id)
            let getGrade = await Connectdb.query("SELECT * FROM lavender.grades where grade_id = " + grade_id)
            if (getGrade.rowCount !== 0 && getTank !== 0) {
                let changeGrade = await Connectdb.query("UPDATE lavender.tanks SET grade_id = " + grade_id + ", tank_name = 'T" + tank_id + "-" + getGrade.rows[0].grade_name + "', tank_description = 'T" + tank_id + "-" + getGrade.rows[0].grade_name+ "', physical_label = 'T" + tank_id + "-" + getGrade.rows[0].grade_name + "' WHERE tank_id = " + tank_id)
                let changeHose = await Connectdb.query("UPDATE lavender.hoses SET grade_id = " + grade_id +", price_profile_id = " + getGrade.rows[0].price_profile_id + ", tank_id = " + tank_id + " WHERE tank_id = " + tank_id)
                if (changeGrade.rowCount === 1 && changeHose.rowCount > 0){

                let message_response = { "message": "Changed grade : " + grade_name +" and mapping Tank id "+tank_id+ " is success, please restart Lavender-dispenser.service" }
                Log_Structure.response_data = message_response;
                Log_Structure.response_StatusCode = 200,
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                ServiceLavender.ServiceLog.WriteLog("ChangeGrade_",JSON.stringify(Log_Structure))
                ServiceLavender.ServiceBackUp.BackupData([{ tableName : "grades", grade_id : grade_id, condition : "grade_id" },
                                                          { tableName : "price_profiles", profile_id : grade_id ,condition : "grade_id" },
                                                          { tableName : "tanks", tank_id : tank_id},
                                                          { tableName : "hoses", tank_id : tank_id , condition : "tank"},])
                res.send(200,message_response)
                return;
            }
            else{
                let message_response = { "message": "Can't Changed grade : " + grade_name +" and mapping Tank id "+tank_id }
                Log_Structure.response_data = message_response;
                Log_Structure.response_StatusCode = 211,
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                ServiceLavender.ServiceLog.WriteLog("ChangeGrade_",JSON.stringify(Log_Structure))
                res.send(211,message_response)
                return;
            }
            }
            else {
              let message_response = { "message": "Not found Tank id or Grade id, please check input data." }
              Log_Structure.response_data = message_response;
              Log_Structure.response_StatusCode = 400,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              ServiceLavender.ServiceLog.WriteLog("ChangeGrade_",JSON.stringify(Log_Structure))
              res.send(400,message_response)
              return;
            }
          }
          else if(setGrade.rowCount === 1 && setPrice.rowCount === 1 && tank_id == 0){
                let message_response = { "message": "Changed grade : " + grade_name + " is success, please restart Lavender-dispenser.service" }
                Log_Structure.response_data = message_response;
                Log_Structure.response_StatusCode = 200,
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                ServiceLavender.ServiceLog.WriteLog("ChangeGrade_",JSON.stringify(Log_Structure))
                res.send(200,message_response)
                return;           
          }
          else{
                let message_response = { "message": "Can't Changed grade : " + grade_name}
                Log_Structure.response_data = message_response;
                Log_Structure.response_StatusCode = 400,
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                ServiceLavender.ServiceLog.WriteLog("ChangeGrade_",JSON.stringify(Log_Structure))
                res.send(400,message_response)
                return; 
          }
        }
        catch (err) {
          Log_Structure.response_data = { "message": err.message};
          Log_Structure.response_StatusCode = 500,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          Log_Structure.api_error=true
          ServiceLavender.ServiceLog.WriteLog("ChangeGrade_",JSON.stringify(Log_Structure))    
          res.send(500, { "message": err.message})
          return;
        }
      
}

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