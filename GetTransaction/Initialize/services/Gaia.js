let site_code;
let chanal_name;
let socket_client;
const _ = require('lodash');
const moment = require("moment");
const config = require("../config");
const io_client = require('socket.io-client');
const Connectdb = config.dbSettings.pool;

exports.socketProcess = async function (transactionsOld, transactionsNew, type) {
    try {
        let feature = await socketFeature();
        if (feature === true && transactionsOld !== null && transactionsNew  !== null && site_code !== '' && site_code !== null) {
            if (type === "ClearPostPay") {
                console.log("ClearPostPay...");
                let msg = "";
                let data = await getData(transactionsNew.rows[0].hose_id);
                let tank_id = data.tank_id;
                let grade_name = data.grade_name;
                let hose_number = data.hose_number;

                msg = site_code + "," +  moment(Date.now()).toISOString() + "," + transactionsNew.rows[0].transaction_id + "," + transactionsNew.rows[0].pump_id + "," + tank_id + "," + hose_number + "," + grade_name + "," +  (new Date(transactionsNew.rows[0].completed_ts)).toISOString() + "," + (new Date(transactionsNew.rows[0].cleared_ts)).toISOString() +
                                "," + transactionsNew.rows[0].delivery_type + "," + transactionsOld.rows[0].delivery_type + "," + transactionsNew.rows[0].delivery_volume + "," + transactionsNew.rows[0].delivery_value + "," + transactionsNew.rows[0].sell_price + "," + transactionsNew.rows[0].cleared_by + "," + transactionsOld.rows[0].reserved_by + "," +
                                transactionsNew.rows[0].total_meter_volume + "," + transactionsNew.rows[0].total_meter_value;
                //console.log(msg);

                // msg = site_code + "," + moment(Date.now()).toISOString() + "," + transactionsNew.rows[0].transaction_id + "," + transactionsNew.rows[0].pump_id + "," + tank_id + "," + hose_number + "," + grade_name + "," + (new Date(transactionsNew.rows[0].completed_ts)).toISOString() +
                //     "," + transactionsNew.rows[0].delivery_type + "," + transactionsNew.rows[0].delivery_volume + "," + transactionsNew.rows[0].delivery_value + "," + transactionsNew.rows[0].sell_price + "," + transactionsNew.rows[0].total_meter_volume + "," + transactionsNew.rows[0].total_meter_value;
                // console.log(msg);
                
                sendData(msg);
            } else if (type === "ClearAllPostPay") {
                let msg = "";
                let data = await getData(transactionsNew.rows[0].hose_id);
                let tank_id = data.tank_id;
                let grade_name = data.grade_name;
                let hose_number = data.hose_number;

                msg = site_code + "," +  moment(Date.now()).toISOString() + "," + transactionsNew.rows[0].transaction_id + "," + transactionsNew.rows[0].pump_id + "," + tank_id + "," + hose_number + "," + grade_name + "," +  (new Date(transactionsNew.rows[0].completed_ts)).toISOString() + "," + (new Date(transactionsNew.rows[0].cleared_ts)).toISOString() +
                                "," + transactionsNew.rows[0].delivery_type + "," + transactionsOld.delivery_type + "," + transactionsNew.rows[0].delivery_volume + "," + transactionsNew.rows[0].delivery_value + "," + transactionsNew.rows[0].sell_price + "," + transactionsNew.rows[0].cleared_by + "," + transactionsOld.reserved_by + "," +
                                transactionsNew.rows[0].total_meter_volume + "," + transactionsNew.rows[0].total_meter_value;
                //console.log(msg);

                // msg = site_code + "," + moment(Date.now()).toISOString() + "," + transactionsNew.rows[0].transaction_id + "," + transactionsNew.rows[0].pump_id + "," + tank_id + "," + hose_number + "," + grade_name + "," + (new Date(transactionsNew.rows[0].completed_ts)).toISOString() +
                //     "," + transactionsNew.rows[0].delivery_type + "," + transactionsNew.rows[0].delivery_volume + "," + transactionsNew.rows[0].delivery_value + "," + transactionsNew.rows[0].sell_price + "," + transactionsNew.rows[0].total_meter_volume + "," + transactionsNew.rows[0].total_meter_value;
                // console.log(msg);
                
                sendData(msg);
            } else if (type === "ClearTest") {
                console.log("ClearTest...");
                let msg = "";
                let data = await getData(transactionsNew.rows[0].hose_id);
                let tank_id = data.tank_id;
                let grade_name = data.grade_name;
                let hose_number = data.hose_number;

                msg = site_code + "," +  moment(Date.now()).toISOString() + "," + transactionsNew.rows[0].transaction_id + "," + transactionsNew.rows[0].pump_id + "," + tank_id + "," + hose_number + "," + grade_name + "," +  (new Date(transactionsNew.rows[0].completed_ts)).toISOString() + "," + (new Date(transactionsNew.rows[0].cleared_ts)).toISOString() +
                                "," + transactionsNew.rows[0].delivery_type + "," + transactionsOld.rows[0].delivery_type + "," + transactionsNew.rows[0].delivery_volume + "," + transactionsNew.rows[0].delivery_value + "," + transactionsNew.rows[0].sell_price + "," + transactionsNew.rows[0].cleared_by + "," + transactionsOld.rows[0].reserved_by + "," +
                                transactionsNew.rows[0].total_meter_volume + "," + transactionsNew.rows[0].total_meter_value;
                // console.log(msg);

                // msg = site_code + "," + moment(Date.now()).toISOString() + "," + transactionsNew.rows[0].transaction_id + "," + transactionsNew.rows[0].pump_id + "," + tank_id + "," + hose_number + "," + grade_name + "," + (new Date(transactionsNew.rows[0].completed_ts)).toISOString() +
                //     "," + transactionsNew.rows[0].delivery_type + "," + transactionsNew.rows[0].delivery_volume + "," + transactionsNew.rows[0].delivery_value + "," + transactionsNew.rows[0].sell_price + "," + transactionsNew.rows[0].total_meter_volume + "," + transactionsNew.rows[0].total_meter_value;
                // console.log(msg);
                
                sendData(msg);
            } else if (type === "ClearAllTest") {
                console.log("ClearAllTest...");
                let msg = "";
                let data = await getData(transactionsNew.rows[0].hose_id);
                let tank_id = data.tank_id;
                let grade_name = data.grade_name;
                let hose_number = data.hose_number;

                msg = site_code + "," +  moment(Date.now()).toISOString() + "," + transactionsNew.rows[0].transaction_id + "," + transactionsNew.rows[0].pump_id + "," + tank_id + "," + hose_number + "," + grade_name + "," +  (new Date(transactionsNew.rows[0].completed_ts)).toISOString() + "," + (new Date(transactionsNew.rows[0].cleared_ts)).toISOString() +
                                "," + transactionsNew.rows[0].delivery_type + "," + transactionsOld.delivery_type + "," + transactionsNew.rows[0].delivery_volume + "," + transactionsNew.rows[0].delivery_value + "," + transactionsNew.rows[0].sell_price + "," + transactionsNew.rows[0].cleared_by + "," + transactionsOld.reserved_by + "," +
                                transactionsNew.rows[0].total_meter_volume + "," + transactionsNew.rows[0].total_meter_value;
                // console.log(msg);

                // msg = site_code + "," + moment(Date.now()).toISOString() + "," + transactionsNew.rows[0].transaction_id + "," + transactionsNew.rows[0].pump_id + "," + tank_id + "," + hose_number + "," + grade_name + "," + (new Date(transactionsNew.rows[0].completed_ts)).toISOString() +
                //     "," + transactionsNew.rows[0].delivery_type + "," + transactionsNew.rows[0].delivery_volume + "," + transactionsNew.rows[0].delivery_value + "," + transactionsNew.rows[0].sell_price + "," + transactionsNew.rows[0].total_meter_volume + "," + transactionsNew.rows[0].total_meter_value;
                // console.log(msg);
                
                sendData(msg);
            } else {
                console.log("Type not macth!!!");
            }
        }
    } catch (err) {
        console.log(err);
    }
}

async function site_Code() {
    try {
        const query = "SELECT * FROM lavender.site_config WHERE key = 'Site_Code'";
        let resultQuery = await Connectdb.query(query);
        if (resultQuery.rowCount > 0) {
            try {
                const Site_Code = resultQuery.rows[0].value
                return Site_Code;
            }
            catch (err) {
                return "";
            }
        }
    } catch (err) {
        return "";
    }
}

async function getIp_GAIA() {
    try {
        const query = "SELECT * FROM lavender.site_config WHERE key = 'IP_Cloud_GAIA'";
        let resultQuery = await Connectdb.query(query);
        if (resultQuery.rowCount > 0) {
            try {
                const IP_GAIA = resultQuery.rows[0].value
                return IP_GAIA;
            }
            catch (err) {
                return "";
            }
        }
    } catch (err) {
        return "";
    }
}

async function getToken_GAIA() {
    try {
        const query = "SELECT * FROM lavender.site_config WHERE key = 'Token_Cloud_GAIA'";
        let resultQuery = await Connectdb.query(query);
        if (resultQuery.rowCount > 0) {
            try {
                const TOKEN_GAIA = resultQuery.rows[0].value
                return TOKEN_GAIA;
            }
            catch (err) {
                return "";
            }
        }
    } catch {
        return "";
    }
}

async function socketName_PumpTransaction() {
    try {
        const query = "SELECT * FROM lavender.lavender_socket WHERE socket_name='PumpTransaction'";
        let resultQuery = await Connectdb.query(query);
        if (resultQuery.rowCount > 0) {
            try {
                const Chanal_Name = resultQuery.rows[0].socket_chanel_name
                return Chanal_Name;
            }
            catch (err) {
                return "";
            }
        }
    } catch {
        return "";
    }
}

async function socketFeature() {
    try {
        const query = "SELECT * FROM lavender.lavender_socket WHERE socket_name='PumpTransaction'";
        let resultQuery = await Connectdb.query(query);
        if (resultQuery.rowCount > 0) {
            try {
                const Feature = resultQuery.rows[0].enable
                return Feature;
            }
            catch (err) {
                return "";
            }
        }
    } catch {
        return "";
    }
}

async function getData(hoseID) {
    try {
        const query = "SELECT lavender.hoses.tank_id,lavender.hoses.hose_number,lavender.grades.grade_name FROM lavender.hoses " +
            "INNER JOIN lavender.grades " +
            "ON lavender.hoses.grade_id = lavender.grades.grade_id " +
            "WHERE lavender.hoses.hose_id = " + hoseID;
        let resultQuery = await Connectdb.query(query);
        if (resultQuery.rowCount > 0) {
            try {
                const data = resultQuery.rows[0];
                return data;
            }
            catch (err) {
                return "";
            }
        }
    } catch (err) {
        return "";
    }
}

async function socketConnect() {
    try {
        console.log("socketConnect...");
        const query = `UPDATE lavender.lavender_socket SET status=1,last_sent_date=now() WHERE socket_name='PumpTransaction';`;
        await Connectdb.query(query);
    } catch (err) {
        console.log(err);
    }
}

async function socketDisconnect() {
    try {
        console.log("socketDisconnect...");
        const query = `UPDATE lavender.lavender_socket SET status=0 WHERE socket_name='PumpTransaction';`;
        await Connectdb.query(query);
    } catch (err) {
        console.log(err);
    }
}

async function sendData(msg) {
    try {
        socket_client.emit(chanal_name, msg);
    } catch (err) {
        console.log(err);
    }
}

async function socketRun() {
    site_code = await site_Code();
    chanal_name = await socketName_PumpTransaction();
    const url = await getIp_GAIA();
    const token = await getToken_GAIA();
    let path = url.split('/')[3];

    socket_client = await io_client(url, {
        path: "/" + path,
        extraHeaders: { 'token': token }
    });

    socket_client.on('connect', async () => {
        socketConnect();
    })

    socket_client.on("disconnect", async () => {
        socketDisconnect();
    });
}

socketRun();
