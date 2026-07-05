const config = require('../config')
const auth = require('basic-auth')
const Connectdb = config.dbSettings.pool;
const _ = require('lodash');
const ServiceLavender = require('../services/index.js')
const moment = require('moment')
module.exports.isAuthen = async (req, res, next) => {
    let credentials = await auth(req)
    let ip_request = await check_ip(req);
    if (_.isEmpty(credentials) === false) {

        let authen = await check(credentials.name, credentials.pass, ip_request)
      
        if (authen === true) {
            req.ip_request = ip_request
            req.terminal_id = credentials.name
        
        } else {

            let Log_Structure = {
                time_request:moment().format('YYYY-MM-DD HH:mm:ss'),
                ip_request: ip_request,
                terminal_id: credentials.name,
                request_body : req.body,
                response_StatusCode:401,
                response_data : {"message": "Access denied, incorrect Username or Password."},
                time_response:moment().format('YYYY-MM-DD HH:mm:ss'),
                api_error:false
                
              }
            ServiceLavender.ServiceLog.WriteLog("Authorize_Fial_",JSON.stringify(Log_Structure))

            res.send(401, {
                "message": "Access denied, incorrect Username or Password."
            })
            return;

        }

    } else {
        let Log_Structure = {
            time_request:moment().format('YYYY-MM-DD HH:mm:ss'),
            ip_request: ip_request,
            terminal_id: credentials.name,
            request_body : req.body,
            response_StatusCode:401,
            response_data : {"message": "Access denied, incorrect Username or Password."},
            time_response:moment().format('YYYY-MM-DD HH:mm:ss'),
            api_error:false
            
          }
        ServiceLavender.ServiceLog.WriteLog("Authorize_Fial_",JSON.stringify(Log_Structure))
        res.send(401, {
            "message": "Access denied, incorrect Username or Password."
        })
        return;
    }
    next()
}

async function check(terminal_id, password_api, ip) {
    return new Promise(async (resolve, reject) => {
        try {

            let check_password = await Connectdb.query("select count(*) from lavender.user_api where terminal_id = " + Number(terminal_id) + " and password_api = '" + password_api + "' and ip_address = '" + ip + "'");

            if (check_password.rows[0].count > 0) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (err) {
            console.log(err.message)
            resolve(false)
        }
    })
}


async function check_ip(req) {
    return new Promise(async (resolve, reject) => {
        try {
            let ip = await req.header('x-forwarded-for') || req.connection.remoteAddress;
            let ip_client = ip.toString().split(":");
            resolve(ip_client[3])

        } catch (error) {
            resolve()

        }

        ;

    })
}