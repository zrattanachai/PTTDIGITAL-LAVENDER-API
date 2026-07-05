const config = require('../config')
const Connectdb = config.dbSettings.pool;
const moment = require('moment')
const ServiceLavender = require('../services/index.js')
const _ = require('lodash');

exports.GetPriceByPump = async function (req, res, next) {
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


  if (!pumpid || !hosenumber) {
    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("GetPriceByPump_",JSON.stringify(Log_Structure))

    res.send(400,message_response)
    return;
    }
    try{
      let resultQuery = await Connectdb.query("SELECT hoses.pump_id, hoses.hose_id,hoses.hose_number, hoses.grade_id, price_profiles.profile_id ,price_profiles.price_level_1, price_profiles.price_level_2, hoses.active_price_level " +
                                                "FROM lavender.price_profiles INNER JOIN lavender.hoses ON price_profiles.profile_id = hoses.price_profile_id " +
                                                "WHERE hoses.pump_id = " + pumpid + " AND hoses.hose_number = " + hosenumber + "")

      if (resultQuery.rowCount > 0) {
        let message_response = resultQuery.rows
        Log_Structure.response_data = message_response;
        Log_Structure.response_StatusCode = 200,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        ServiceLavender.ServiceLog.WriteLog("GetPriceByPump_",JSON.stringify(Log_Structure))
        res.send(200,message_response)
        return;

        }
        else{
          let message_response = {"message" : "Result not found."}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 212,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          Log_Structure.api_error=false
          ServiceLavender.ServiceLog.WriteLog("GetPriceByPump_",JSON.stringify(Log_Structure))  
          res.send(212, message_response)
          return;
		}

      }
      catch (err) {
        Log_Structure.response_data = {"message":err.messaeg};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("GetPriceByPump_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      }
    
}
exports.SetPrice = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const grade_id = req.body.grade_id;
  const pricelevel1 = req.body.pricelevel1;
  const pricelevel2 = req.body.pricelevel2;
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

  if (!grade_id || !pricelevel1 || !pricelevel2) {
    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("SetPrice_",JSON.stringify(Log_Structure))

    res.send(400,message_response)
    return;
    }

    try{
        let resultsPriceProfile = await Connectdb.query(`SELECT grades.price_profile_id, grades.grade_name FROM lavender.grades INNER JOIN lavender.price_profiles ON grades.price_profile_id = price_profiles.profile_id WHERE grades.grade_id = ${grade_id}`)
        if (resultsPriceProfile.rowCount !== 0) {
          try {
            let resultQueryPriceProfile = await Connectdb.query(`UPDATE lavender.price_profiles SET price_level_1 = ${pricelevel1} , price_level_2 = ${pricelevel2} WHERE profile_id = ${resultsPriceProfile.rows[0].price_profile_id}`)
            if (resultQueryPriceProfile.rowCount > 0) {
              try {
                let getPump = await Connectdb.query("select * from lavender.hoses as h JOIN lavender.grades as g on h.grade_id = g.grade_id where g.grade_id = '" + grade_id + "' ")
                if (getPump.rowCount > 0) {
                  try {
                      await Promise.all(getPump.rows.map(async (data, i) => {
                      Connectdb.query(`INSERT INTO lavender.pump_commands (command,pump_id,hose_number,value,create_date) values ('set price',${data.pump_id},${data.hose_number},${pricelevel1},now())`)
                      Connectdb.query(`COMMIT`)

                    }))
                  } catch (err) {
                    Log_Structure.response_data = {"message":err.messaeg};
                    Log_Structure.response_StatusCode = 500,
                    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                    Log_Structure.api_error=true
                    ServiceLavender.ServiceLog.WriteLog("SetPrice_",JSON.stringify(Log_Structure))    
                    res.send(500, { "message": err.message})
                    return;
                  }
               
                }

                let message_response = { "message":'Update Price By GradeID : ' + grade_id + ', Pricelevel1 : ' + pricelevel1 + ', Pricelevel2 : ' + pricelevel2 + ' is success.'}
                Log_Structure.response_data = message_response;
                Log_Structure.response_StatusCode = 200,
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                ServiceLavender.ServiceLog.WriteLog("SetPrice_",JSON.stringify(Log_Structure))
                ServiceLavender.ServiceBackUp.BackupData([{tableName:"price_profiles",profile_name:resultsPriceProfile.rows[0].grade_name}])
                res.send(200,message_response)
                return;

              }
              catch (err) {
                Log_Structure.response_data = {"message":err.messaeg};
                Log_Structure.response_StatusCode = 500,
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                Log_Structure.api_error=true
                ServiceLavender.ServiceLog.WriteLog("SetPrice_",JSON.stringify(Log_Structure))    
                res.send(500, { "message": err.message})
                return;
              }
            }
            else{
              let message_response = { "message":'Can not Update Price By GradeID : ' + grade_id + ', Pricelevel1 : ' + pricelevel1 + ', Pricelevel2 : ' + pricelevel2 + '.'}
              Log_Structure.response_data = message_response;
              Log_Structure.response_StatusCode = 211,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              ServiceLavender.ServiceLog.WriteLog("SetPrice_",JSON.stringify(Log_Structure))
              res.send(211,message_response)
              return;
			}
          }
          catch (err) {
            Log_Structure.response_data = {"message":err.messaeg};
            Log_Structure.response_StatusCode = 500,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.api_error=true
            ServiceLavender.ServiceLog.WriteLog("SetPrice_",JSON.stringify(Log_Structure))    
            res.send(500, { "message": err.message})
            return;
          }
        }
        else {
          let message_response = { "message":"Incorrect Parameter."}
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 400,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("SetPrice_",JSON.stringify(Log_Structure))
          res.send(400,message_response)
          return;
        }
      }
      catch (err) {
        Log_Structure.response_data = {"message":err.messaeg};
        Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error=true
        ServiceLavender.ServiceLog.WriteLog("SetPrice_",JSON.stringify(Log_Structure))    
        res.send(500, { "message": err.message})
        return;
      }
    
}
