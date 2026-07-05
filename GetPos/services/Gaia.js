let socket;
let site_code;
let featureLog;
let chanal_namePumpLogs;
const _ = require('lodash');
const moment = require("moment");
const config = require("../config");
const ioClient = require('socket.io-client');
const Connectdb = config.dbSettings.pool;

exports.socketProcess = async function (type, msgLog) {
    try {
        if (socket.connected === true && featureLog === true && msgLog !== null && site_code !== '' && site_code !== null) {
            if (type === "SetPosStatus") {
                let msg = "";
                msg = site_code + "," + moment(Date.now()).toISOString() + "," + "0" + "," + "0" + "," + msgLog.time_response + "," + "Info" + "," + msgLog.response_data.message;
                sendData(chanal_namePumpLogs, msg)
            } else if (type === "SetPosShift") {
                if (msgLog.request_body.status == 0) {
                    let msg = "";
                    msg = site_code + "," + moment(Date.now()).toISOString() + "," + "0" + "," + "0" + "," + msgLog.time_response + "," + "Info" + "," + `Update Pos Shift Close by terminal id : ${msgLog.request_body.terminal_id} is successful.`;
                    sendData(chanal_namePumpLogs, msg)
                } else if (msgLog.request_body.status == 1) {
                    let msg = "";
                    msg = site_code + "," + moment(Date.now()).toISOString() + "," + "0" + "," + "0" + "," + msgLog.time_response + "," + "Info" + "," + `Update Pos Shift Open by terminal id : ${msgLog.request_body.terminal_id} is successful.`;
                    sendData(chanal_namePumpLogs, msg)
                } else {
                    console.log("Status not macth!!!");
                }
            } else {
                console.log("Type not macth!!!");
            }
        }
    } catch (err) {
        console.log(err);
    }
}

async function socketInitial() {
    try {
        const url = await getIp_GAIA();
        const token = await getToken_GAIA();
        let path = url.split('/')[3];

        socket = await ioClient(url, {
            path: "/" + path,
            extraHeaders: { 'token': token }
        });

        socket.on('connect', async () => {
            socketConnect();
        })

        socket.on("disconnect", async () => {
            socketDisconnect();
        });

    } catch (err) {
        console.log(err);
    }
}

async function siteCode() {
    try {
        const query = "SELECT * FROM lavender.site_config WHERE key = 'Site_Code'";
        let resultQuery = await Connectdb.query(query);
        if (resultQuery.rowCount > 0) {
            try {
                const Site_Code = resultQuery.rows[0].value
                site_code = Site_Code;
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

async function socketName_PumpLogs() {
    try {
        const query = "SELECT * FROM lavender.lavender_socket WHERE socket_name='PumpLogs'";
        let resultQuery = await Connectdb.query(query);
        if (resultQuery.rowCount > 0) {
            try {
                const Chanal_Name = resultQuery.rows[0].socket_chanel_name
                chanal_namePumpLogs = Chanal_Name;
            }
            catch (err) {
                return "";
            }
        }
    } catch {
        return "";
    }
}

async function socketFeature_PumpLogs() {
    try {
        const query = "SELECT * FROM lavender.lavender_socket WHERE socket_name='PumpLogs'";
        let resultQuery = await Connectdb.query(query);
        if (resultQuery.rowCount > 0) {
            try {
                const Feature = resultQuery.rows[0].enable
                featureLog = Feature;
            }
            catch (err) {
                return "";
            }
        }
    } catch {
        return "";
    }
}

async function socketConnect() {
    try {
        console.log("socketConnect...");
    } catch (err) {
        console.log(err);
    }
}

async function socketDisconnect() {
    try {
        console.log("socketDisconnect...");
    } catch (err) {
        console.log(err);
    }
}

async function sendData(chanal_name, msg) {
    try {
        console.log(msg)
        socket.emit(chanal_name, msg);
    } catch (err) {
        console.log(err);
    }
}

async function Initial() {
    await siteCode();
    await socketName_PumpLogs();
    await socketFeature_PumpLogs();
    await socketInitial()
}

Initial();
