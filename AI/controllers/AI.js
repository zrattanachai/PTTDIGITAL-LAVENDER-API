const fs = require('fs');
const moment = require('moment');
const config = require('../config');
const jwt = require('jsonwebtoken');
const { exec } = require('child_process');
const { forEach } = require('lodash');
const Connectdb = config.dbSettings.pool;

exports.Login = async function (req, res, next) {
    try {
        const { Username, Password } = req.body
        let user = await Connectdb.query(`SELECT * FROM lavender.users_manager WHERE user_name = '${Username}'`);
        if (user.rowCount > 0) {
            if (!(Password == user.rows[0].password)) {
                res.send(400, { message: `Password Invalid!!!` })
                return;
            }

            var payload = {
                user: {
                    name: user.user_name
                }
            }

            jwt.sign(payload, 'jwt-secret', { expiresIn: "30m" }, (err, token) => {
                if (err) throw err;
                res.send(200, { token: token });
            });

        } else {
            res.send(400, { message: `User not found: ${Username}!!!` })
        }
        next()
    } catch (err) {
        res.send(400, { message: err.message })
    }
}

exports.ServiceManagement = async function (req, res, next) {
    try {
        let service_name = req.body.service_name
        let method = req.body.method
        if (!service_name || !method) {
            res.send(400, { message: "Incorrect Parameter or Parameter format." })
            return;
        }
        if (method != "start" && method != "stop" && method != "restart" && method != "status" ) {
            res.send(400, { message: "Incorrect Parameter or Parameter format." })
            return;
        }
        if (service_name === "pm2") {
            if(method == "status"){
                await exec(`systemctl ${method} ${service_name}-root`, (error, stdout, stderr) => {
                   if (error) {
                       res.send(200, { message: "inactive"});
                       return;
                   }
                   if (stderr) {
                       res.send(200, { message: "inactive" });
                       return;
                   }
                   if (stdout.includes("(running)")) {
                       res.send(200, { message: "active" });
                       return;
                   }
                })
            } else {
                if(method == "stop"){
                       res.send(200, { message: "can not use this method"});
                       return;
                }
                if (method == "restart") {
                       res.send(200, { message: "Successfull."});
                }
                if (method == "start") {
                	await exec(`${service_name} ${method} all`, (error, stdout, stderr) => {
                   		if (error) {
                       			res.send(401, { message: error.message });
                       			return;
                   		}
                   		if (stderr) {
                       			res.send(401, { message: stderr.message });
                       			return;
                   		}
                        })
			res.send(200, { message: "Successfull." })
           	}
            }
        } else {
           if (method == "status") {
                await exec(`systemctl ${method} ${service_name}`, (error, stdout, stderr) => {
                   if (error) {
                       console.log("error : " + error);
                       res.send(200, { message: "inactive"});
                       return;
                   }
                   if (stderr) {
                       console.log("stderr : " + stderr);
                       res.send(200, { message: "inactive" });
                       return;
                   }
                   if (stdout.includes("(running)")) {
                       res.send(200, { message: "active" });
                       return;
                   }
                })
            } else {
                await exec(`systemctl ${method} ${service_name}`, (error, stdout, stderr) => {
                   if (error) {
                       res.send(401, { message: error.message });
                       return;
                   }
                   if (stderr) {
                       res.send(401, { message: stderr.message });
                       return;
                   }
                   res.send(200, { message: "Successfull." })
               })
            }
        }
    } catch (err) {
        console.log(err)
        res.send(400, { message: err.message })
    }
}

exports.ClearAlarm = async function (req, res, next) {
    try {
        let pump_id = req.body.pump_id;
        let alarm_id = req.body.alarm_id;

        if (!alarm_id || !pump_id) {
            let message_response = { "message": "Incorrect Parameter or Parameter format." }
            res.send(400, message_response)
            return;
        }
        if (alarm_id < 1 || alarm_id > 16) {
            let message_response = { "message": "Incorrect Parameter or Parameter format." }
            res.send(400, message_response)
            return;
        }
        let resultQuery = await Connectdb.query(`select * from lavender.pumps_real_time where pump_id = ${pump_id}`)
        if (resultQuery.rowCount > 0) {
            try {
                let resultResponse = await Connectdb.query(`UPDATE lavender.pumps_real_time SET alarm_id= ${Number(0)}, alarm = '[]'::jsonb WHERE pump_id = ${pump_id}`)
                if (resultResponse.rowCount === 1) {
                    let message_response = { "message": "Clear Alarm " + alarm_id + " on Pump ID : " + pump_id + " is successful." }
                    res.send(200, message_response)
                    return;
                }
                else {
                    let message_response = { "message": "Can not Clear Alarm " + alarm_id + " on Pump ID : " + pump_id + "." }
                    res.send(211, message_response)
                    return;
                }
            }
            catch (err) {
                Log_Structure.response_data = { "message": err.message };
                res.send(500, { "message": err.message })
                return;
            }
        }
        else {
            let message_response = { "message": "Result not found." }
            res.send(212, message_response)
            return;
        }
    }
    catch (err) {
        res.send(500, { "message": err.message })
        return;
    }
}

exports.RollbackTransaction = async function (req, res, next) {
    try {
        let transaction_id = req.body.transaction_id;
        if (!transaction_id) {
            let message_response = { "message": "Incorrect Parameter or Parameter format." }
            res.send(400, message_response)
            return;
        }

        let resultQuery = await Connectdb.query(`SELECT * FROM lavender.transactions_bk WHERE transaction_id = ${transaction_id}`);
        if (resultQuery.rowCount > 0) {
            await Connectdb.query(`INSERT INTO lavender.transactions( transaction_id, pump_id, hose_id, price_level, completed_ts, delivery_type, delivery_volume, delivery_value, sell_price, cleared_by, reserved_by, total_meter_volume, total_meter_value) VALUES (${resultQuery.rows[0].transaction_id}, ${resultQuery.rows[0].pump_id}, ${resultQuery.rows[0].hose_id},  ${resultQuery.rows[0].price_level},  '${moment.utc(resultQuery.rows[0].completed_ts).local().format('YYYY-MM-DD HH:mm:ss.SSSS')}',  2, ${resultQuery.rows[0].delivery_volume}, ${resultQuery.rows[0].delivery_value},  ${resultQuery.rows[0].sell_price}, null, null, ${resultQuery.rows[0].total_meter_volume}, ${resultQuery.rows[0].total_meter_value});`)
            await Connectdb.query(`DELETE FROM lavender.transactions_bk WHERE transaction_id = ${transaction_id}`)
            let message_response = { "message": `Rollback transaction_id ${transaction_id} is successful.` }
            res.send(200, message_response)
            return;
        } else {
            let message_response = { "message": "Result not found." }
            res.send(212, message_response)
            return;
        }
    } catch (err) {
        res.send(500, { "message": err.message })
        return;
    }
}

exports.SetStackByPump = async function (req, res, next) {
    try {
        const pump_id = req.body.pump_id;
        const stack = req.body.stack;

        if (!pump_id || !stack || stack < 1) {
            let message_response = { "message": "Incorrect Parameter or Parameter format." }
            res.send(400, message_response)
            return;
        }
        let resultResponse = await Connectdb.query(`UPDATE lavender.pumps SET stack_limit= ${stack} WHERE pump_id = ${pump_id}`)
        if (resultResponse.rowCount === 1) {
            let message_response = { "message": "Update Stack by Pump ID : " + pump_id + " is success, please restart Lavender-dispenser.service" }
            res.send(200, message_response)
            return;
        } else {
            let message_response = { "message": "Can not Update Stack by Pump ID : " + pump_id }
            res.send(211, message_response)
            return;
        }
    }
    catch (err) {
        res.send(500, { "message": err.message })
        return;
    }
}

exports.GetPumpRealtime = async function (req, res, next) {
    try {
        const resultQuery = await Connectdb.query(`SELECT pump_id,volume,value,sell_price,status,notification,last_update,alarm_id,alarm FROM lavender.pumps_real_time ORDER BY pump_id ASC `)
        if (resultQuery.rowCount > 0) {
            res.send(200, resultQuery.rows)
            return;
        } else {
            res.send(200, [] )
            return;
        }
    } catch (err) {
        res.send(500, { "message": err.message })
        return;
    }
}

exports.GetCommands_bk = async function (req, res, next) {
    try {
        let data = JSON.parse(req.body);
        const pump_id = data.pump_id;
        const startdate = data.log_start_time;
        const enddate = data.log_end_time;
        if (!pump_id || !startdate || !enddate) {
            let message_response = { "message": "Incorrect Parameter or Parameter format." }
            res.send(400, message_response)
            return;
        }
        const resultQuery = await Connectdb.query(`SELECT command_id,command,pump_id,hose_number,value,create_date,completed_date FROM lavender.commands_bk WHERE pump_id IN (${pump_id}) AND create_date BETWEEN '${startdate}' AND '${enddate}' ORDER BY command_id ASC`)
        if (resultQuery.rowCount > 0) {
            res.send(200, resultQuery.rows)
            return;
        } else {
            res.send(200, [] )
            return;
        }
    } catch (err) {
        res.send(500, { "message": err.message })
        return;
    }
}

//more
exports.GetTransactions = async function (req, res, next) {
    try {
        let data = JSON.parse(req.body);
        const pump_id = data.pump_id;
        const startdate = data.log_start_time;
        const enddate = data.log_end_time;
        if (!pump_id || !startdate || !enddate) {
            let message_response = { "message": "Incorrect Parameter or Parameter format." }
            res.send(400, message_response)
            return;
        }
        const resultQuery = await Connectdb.query(`SELECT  transaction_id,pump_id,hose_id,price_level,completed_ts,cleared_ts,delivery_type,delivery_volume,delivery_value,sell_price,cleared_by,reserved_by,total_meter_volume,total_meter_value
        FROM lavender.transactions WHERE pump_id IN (${pump_id}) AND completed_ts BETWEEN '${startdate}' AND '${enddate}' ORDER BY transaction_id ASC`)
        if (resultQuery.rowCount > 0) {
            res.send(200, resultQuery.rows)
            return;
        } else {
            res.send(200, [] )
            return;
        }
    } catch (err) {
        res.send(500, { "message": err.message })
        return;
    }
}

exports.GetTransactions_bk = async function (req, res, next) {
    try {
        let data = JSON.parse(req.body);
        const pump_id = data.pump_id;
        const startdate = data.log_start_time;
        const enddate = data.log_end_time;
        if (!pump_id || !startdate || !enddate) {
            let message_response = { "message": "Incorrect Parameter or Parameter format." }
            res.send(400, message_response)
            return;
        }
        const resultQuery = await Connectdb.query(`SELECT  transaction_id,pump_id,hose_id,price_level,completed_ts,cleared_ts,delivery_type,delivery_volume,delivery_value,sell_price,cleared_by,reserved_by,total_meter_volume,total_meter_value
        FROM lavender.transactions_bk WHERE pump_id IN (${pump_id}) AND completed_ts BETWEEN '${startdate}' AND '${enddate}' ORDER BY transaction_id ASC`)
        if (resultQuery.rowCount > 0) {
            res.send(200, resultQuery.rows)
            return;
        } else {
            res.send(200, [] )
            return;
        }
    } catch (err) {
        res.send(500, { "message": err.message })
        return;
    }
}

exports.GetTanks = async function (req, res, next) {
    try {
        const resultQuery = await Connectdb.query(`SELECT tank_id,grade_id,tank_name,tank_number,probe_number,capacity,theoretical_volume,tank_alarm_description,tank_type,loop_id FROM lavender.tanks ORDER BY tank_id ASC `)
        if (resultQuery.rowCount > 0) {
            res.send(200, resultQuery.rows)
            return;
        } else {
            res.send(200, [] )
            return;
        }
    } catch (err) {
        res.send(500, { "message": err.message })
        return;
    }
}

exports.GetHoses = async function (req, res, next) {
    try {
        const resultQuery = await Connectdb.query(`SELECT hose_id,pump_id,hose_number,grade_id,price_profile_id,tank_id,total_meter_volume,total_meter_value FROM lavender.hoses ORDER BY hose_id ASC`)
        if (resultQuery.rowCount > 0) {
            res.send(200, resultQuery.rows)
            return;
        } else {
            let message_response = { "message": "Result not found." }
            res.send(212, message_response)
            return;
        }
    } catch (err) {
        res.send(500, { "message": err.message })
        return;
    }
}


exports.GetPumpLogs = async function (req, res, next) {
    try {
        let data = JSON.parse(req.body);
        const pumps = data.pump;
        const startdate = data.log_start_time;
        const enddate = data.log_end_time;


        let pump_id = getPumpID(pumps);
        let hose_number = getHoseNumber(pumps);

        if (!pump_id || !hose_number || !startdate || !enddate) {
            let message_response = { "message": "Incorrect Parameter or Parameter format." }
            res.send(400, message_response)
            return;
        }

        const resultQuery = await Connectdb.query(`SELECT pump_id,hose_number,create_date,catagory,message FROM (SELECT * FROM (SELECT * FROM lavender.pump_logs WHERE create_date BETWEEN '${startdate}' AND '${enddate}') AS subquery WHERE pump_id IN (${pump_id})) AS subquery WHERE hose_number IN (${hose_number}) ORDER BY log_id ASC `)
        if (resultQuery.rowCount > 0) {
            res.send(200, resultQuery.rows)
            return;
        } else {
            res.send(200, [] )
            return;
        }
    } catch (err) {
        res.send(500, { "message": err.message })
        return;
    }
}

function getPumpID(pump) {
    let pumps = "";
    for (let i = 0; i < pump.length; i++) {
        pumps += pump[i].pump_id.toString();
        if (i < pump.length - 1) {
            pumps += ",";
        }
    }
    return pumps;
}

function getHoseNumber(pump) {
    let hoses = "";
    for (let i = 0; i < pump.length; i++) {
        hoses += pump[i].hose_number.toString();
        if (i < pump.length - 1) {
            hoses += ",";
        }
    }
    return hoses;
}
