const config = require('../config')
const Connectdb = config.dbSettings.pool;
const moment = require('moment')
const ServiceLavender = require('../services/index.js')
const _ = require('lodash')
const FTDI = require('ftdi-d2xx');
const { exec } = require('child_process');
let device = null;
let is_open = null;
let serial_number = null;

exports.GetSerialDescription = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  let Log_Structure = {
    time_request: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
    ip_request: ip_request,
    terminal_id: terminal_id,
    request_body: req.body,
    response_StatusCode: "",
    response_data: "",
    time_response: "",
    api_error: false
  }


  try {
    var resultErr = "";
    var resultCmd = "";
    const { exec } = require('child_process');

    await exec('rmmod ftdi_sio', (error, stdout, stderr) => { if (error) { errMessage = error.message; console.log(error.message); return; } if (stderr) { console.log(stderr); return; } })
    await exec('rmmod usbserial', (error, stdout, stderr) => { if (error) { errMessage = error.message; console.log(error.message); return; } if (stderr) { console.log(stderr); return; } })

    await exec(`sudo /usr/share/LavenderSetting/./LavenderSetting 1`, async function (error, stdout, stderr) {
      if (error) {
        resultErr = error.message;
        console.log(error.message);
        Log_Structure.response_data = { "message": resultErr };
        Log_Structure.response_StatusCode = 500,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error = true
        ServiceLavender.ServiceLog.WriteLog("GetSerialDescription_", JSON.stringify(Log_Structure))
        res.send(500, { "message": resultErr })
        return;
      }

      if (stderr) { console.log(stderr); return; }

      if (stdout) {
        resultCmd = stdout;
        if (resultCmd == "") {
          let message_response = { "message": "No Respones" }
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 400,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("GetSerialDescription_", JSON.stringify(Log_Structure))
          res.send(400, { "message": "No Respones" })
        }
        else {
          let res_split = resultCmd.split("\n");
          let message_response = []
          let dataSerialNumber = []
          let resultResponse = Promise.all(
            res_split.map(async (data, i) => {
              if (data.includes("SerialNumber")) {
                let SerialNumber = data.split("=");
                let Description = res_split[i + 1].split("=");
                let data_loopC = {
                  "SerialNumber": SerialNumber[1],
                  "Description": Description[1]
                }
                dataSerialNumber.push(data_loopC);
              }
            })
          );

          try {
            let resultQuery = await Connectdb.query(`select * from lavender.serial_number_card`);
            if (resultQuery.rowCount === 0) {
              let resultResponse = await Promise.all(
                dataSerialNumber.map(async (data, i) => {
                  if (data.SerialNumber !== '') {
                    await Connectdb.query(`INSERT INTO lavender.serial_number_card(serialnumber,description,status) VALUES('${data.SerialNumber}','${data.Description}',${true})`);
                  }
                  return Promise.resolve(data);
                })
              );
              let resultQueryupdate = await Connectdb.query(`select * from lavender.serial_number_card`);

              Log_Structure.response_data = resultQueryupdate.rows;
              Log_Structure.response_StatusCode = 200,
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              ServiceLavender.ServiceLog.WriteLog("GetSerialDescription_", JSON.stringify(Log_Structure))

              res.send(200, resultQueryupdate.rows)
              return;

            } else {
              let resultResponse = await Promise.all(
                dataSerialNumber.map(async (data, i) => {
                  if (resultQuery.rows.findIndex(dataIndex => dataIndex.serialnumber === data.SerialNumber) === -1) {
                    if (data.SerialNumber !== '') {
                      await Connectdb.query(`INSERT INTO lavender.serial_number_card(serialnumber,description,status) VALUES('${data.SerialNumber}','${data.Description}',${true})`);
                    }
                  }
                  return Promise.resolve(data);
                })
              );
              let resultQueryInsert = await Connectdb.query(`select * from lavender.serial_number_card`);
              let resultResponsecheckserial = await Promise.all(
                resultQueryInsert.rows.map(async (data, i) => {
                  if (dataSerialNumber.findIndex(dataIndex => dataIndex.SerialNumber === data.serialnumber) === -1) {
                    await Connectdb.query(`UPDATE lavender.serial_number_card set status = false WHERE serialnumber = '${data.serialnumber}'`);
                  } else {
                    await Connectdb.query(`UPDATE lavender.serial_number_card set status = true WHERE serialnumber = '${data.serialnumber}'`);
                  }
                  return Promise.resolve(data);
                })
              );
              let resultQueryupdate = await Connectdb.query(`select * from lavender.serial_number_card`);
              message_response = resultQueryupdate.rows.filter(datafor => datafor.status === true);
              for (i = 1; i <= 4; i++) {
                let datadescription = "LAV-LOOP" + i
                let result = resultQueryupdate.rows.filter(datafor => datafor.status === false && datafor.description === datadescription);
                if (result.length !== 0) {
                  const max = result.reduce((prev, current) => ((prev.serial_id > current.serial_id) ? prev : current), 0)
                  message_response.push(max)
                }
              }

              Log_Structure.response_data = message_response;
              Log_Structure.response_StatusCode = 200,
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              ServiceLavender.ServiceLog.WriteLog("GetSerialDescription_", JSON.stringify(Log_Structure))

              res.send(200, message_response)
              return;
            }
          } catch (err) {
            Log_Structure.response_data = { "message": err.message };
            Log_Structure.response_StatusCode = 500,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.api_error = true
            ServiceLavender.ServiceLog.WriteLog("GetSerialDescription_", JSON.stringify(Log_Structure))
            res.send(500, { "message": err.message })
            return
          }
        }
      }
    })
  }
  catch (err) {
    Log_Structure.response_data = { "message": err.message };
    Log_Structure.response_StatusCode = 500,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    Log_Structure.api_error = true
    ServiceLavender.ServiceLog.WriteLog("GetSerialDescription_", JSON.stringify(Log_Structure))
    res.send(500, { "message": err.message })
    return
  }

}

exports.SetSerialDescription = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const serialnumber = req.body.serialnumber
  const description = req.body.description
  let Log_Structure = {
    time_request: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
    ip_request: ip_request,
    terminal_id: terminal_id,
    request_body: req.body,
    response_StatusCode: "",
    response_data: "",
    time_response: "",
    api_error: false
  }

  if (!serialnumber || !description) {
    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("SetSerialDescription_", JSON.stringify(Log_Structure))

    res.send(400, message_response)
    return;
  }
  try {
    var resultErr = "";
    var resultCmd = "";
    const { exec } = require('child_process');

    await exec(`sudo /usr/share/LavenderSetting/./LavenderSetting 2 "${serialnumber}" "${description}"`, async function (error, stdout, stderr) {
      if (error) {
        resultErr = error.message;
        console.log(error.message);
        Log_Structure.response_data = { "message": resultErr };
        Log_Structure.response_StatusCode = 500,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        Log_Structure.api_error = true
        ServiceLavender.ServiceLog.WriteLog("SetSerialDescription_", JSON.stringify(Log_Structure))
        res.send(500, { "message": resultErr })
        return;
      }
      if (stderr) { console.log(stderr); return; }
      if (stdout) {
        resultCmd = stdout;
        console.log(stdout);
        if (resultCmd == "") {
          let message_response = { "message": "Can't Setting Description." }
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 212,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("SetSerialDescription_", JSON.stringify(Log_Structure))
          res.send(212, message_response)
        }
        else {
          let remove_n = resultCmd.replace(/\n/g, '');
          let res_split = remove_n.split(" ");
          let Data_result = `Setting ${res_split[2]} ${res_split[3]}`
          if (res_split[0] === "0") {
            try {
              await Connectdb.query(`UPDATE lavender.serial_number_card set description = '${description}' ,status = true WHERE serialnumber = '${serialnumber}'`);

              let message_response = {
                "message": Data_result,
                "status": 0
              }
              Log_Structure.response_data = message_response;
              Log_Structure.response_StatusCode = 200,
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              ServiceLavender.ServiceLog.WriteLog("SetSerialDescription_", JSON.stringify(Log_Structure))
              res.send(200, message_response)
            } catch (err) {
              Log_Structure.response_data = { "message": err.message };
              Log_Structure.response_StatusCode = 500,
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              Log_Structure.api_error = true
              ServiceLavender.ServiceLog.WriteLog("SetSerialDescription_", JSON.stringify(Log_Structure))
              res.send(500, { "message": err.message })
              return
            }

          } else if (res_split[0] === "1") {

            let message_response = {
              "message": Data_result + " Can't Setting.",
              "status": 1
            }
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 400,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("SetSerialDescription_", JSON.stringify(Log_Structure))
            res.send(200, message_response)
          } else {
            let message_response = {
              "message": Data_result + " Check Serialnumber.",
              "status": 2
            }
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 401,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("SetSerialDescription_", JSON.stringify(Log_Structure))
            res.send(200, message_response)
          }

        }
        return;
      }
    })
    return
  }
  catch (err) {
    Log_Structure.response_data = { "message": err.message };
    Log_Structure.response_StatusCode = 500,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    Log_Structure.api_error = true
    ServiceLavender.ServiceLog.WriteLog("SetSerialDescription_", JSON.stringify(Log_Structure))
    res.send(500, { "message": err.message })
    return
  }

}

exports.GetConfigFan = async function (req, res, next) {
  let Data_FTDI = {
    temp_1: 0,
    temp_2: 0,
    temp_now: 0,
    fan: null,
    interval: 0,
    pwm_low: 0,
    pwm_high: 0,
    error: ""
  }

  try {
    //await exec(`systemctl stop lavender-update` , (error, stdout, stderr)=> {if(error){errMessage=error.message;console.log(error.message);return;}if(stderr){console.log(stderr);return;}})
    await exec('rmmod ftdi_sio', (error, stdout, stderr) => { if (error) { errMessage = error.message; console.log(error.message); return; } if (stderr) { console.log(stderr); return; } })
    await exec('rmmod usbserial', (error, stdout, stderr) => { if (error) { errMessage = error.message; console.log(error.message); return; } if (stderr) { console.log(stderr); return; } })

    let deviceList = await FTDI.getDeviceInfoList();
    if (deviceList.find(d => d['description'] === 'LAV-FAN-CTRL') === undefined || deviceList.find(d => d['description'] === 'LAV-FAN-CTRL') === null) {
      Data_FTDI.error = "undefined";
      res.send(200, Data_FTDI)
      return;
    }

    serial_number = deviceList.find(d => d['description'] === 'LAV-FAN-CTRL').serial_number
    is_open = deviceList.find(d => d['description'] === 'LAV-FAN-CTRL').is_open
    if (is_open === false) {
      device = await FTDI.openDevice(serial_number);
      await device.setTimeouts(1000, 1000);
      await device.purge(FTDI.FT_PURGE_RX);
      await device.setBaudRate(9600);
      await device.setDataCharacteristics(FTDI.FT_BITS_8, FTDI.FT_STOP_BITS_1, FTDI.FT_PARITY_NONE);
    }

    await device.purge(FTDI.FT_PURGE_RX)
    let dataReq = await JSON.stringify(req.body)
    let dataWrite = await Buffer.alloc(dataReq.length, dataReq);
    await device.write(dataWrite);
    let response = await device.read(1024);
    response = await String.fromCharCode(...response);
    console.log(response);
    if (response.search("}{") !== -1) {
      let s = response.split("{");
      s.forEach(e => {
        if (e.length > 25) {
          response = '{' + e;
        }
      });
    }

    if (response.length < 25) {
      Data_FTDI.temp_1 = 0,
        Data_FTDI.temp_2 = 0,
        Data_FTDI.temp_now = 0,
        Data_FTDI.fan = null,
        Data_FTDI.interval = 0,
        Data_FTDI.pwm_low = 0,
        Data_FTDI.pwm_high = 0,
        Data_FTDI.error = "massage not macth command request.";
      response = await JSON.stringify(Data_FTDI);

      await FTDI.closeDevice;
      await device.close;
      Data_FTDI = JSON.parse(response);
      res.send(200, Data_FTDI);
      //await exec(`systemctl start lavender-update`, (error, stdout, stderr) => { if (error) { errMessage = error.message; console.log(error.message); return; } if (stderr) { console.log(stderr); return; } })
      return;
    }

    await FTDI.closeDevice;
    await device.close;
    Data_FTDI = JSON.parse(response);
    Data_FTDI.error = "";
    res.send(200, Data_FTDI);
    //await exec(`systemctl start lavender-update`, (error, stdout, stderr) => { if (error) { errMessage = error.message; console.log(error.message); return; } if (stderr) { console.log(stderr); return; } })
  } catch (err) {
    Data_FTDI = null;
    Data_FTDI.temp_1 = 0,
      Data_FTDI.temp_2 = 0,
      Data_FTDI.temp_now = 0,
      Data_FTDI.fan = null,
      Data_FTDI.interval = 0,
      Data_FTDI.pwm_low = 0,
      Data_FTDI.pwm_high = 0,
      Data_FTDI.error = err.message;
    device.close;
    res.send(500, Data_FTDI)
  }
}

exports.SetConfigFan = async function (req, res, next) {

  let Data_FTDI = {
    status: null,
    error: ""
  }

  try {
    //await exec(`systemctl stop lavender-update`, (error, stdout, stderr) => { if (error) { errMessage = error.message; console.log(error.message); return; } if (stderr) { console.log(stderr); return; } })
    await exec('rmmod ftdi_sio', (error, stdout, stderr) => { if (error) { errMessage = error.message; console.log(error.message); return; } if (stderr) { console.log(stderr); return; } })
    await exec('rmmod usbserial', (error, stdout, stderr) => { if (error) { errMessage = error.message; console.log(error.message); return; } if (stderr) { console.log(stderr); return; } })

    let deviceList = await FTDI.getDeviceInfoList();
    if (deviceList.find(d => d['description'] === 'LAV-FAN-CTRL') === undefined || deviceList.find(d => d['description'] === 'LAV-FAN-CTRL') === null) {
      Data_FTDI.error = "undefined";
      res.send(200, Data_FTDI)
      return;
    }

    serial_number = deviceList.find(d => d['description'] === 'LAV-FAN-CTRL').serial_number
    is_open = deviceList.find(d => d['description'] === 'LAV-FAN-CTRL').is_open
    if (is_open === false) {
      device = await FTDI.openDevice(serial_number);
      await device.setTimeouts(1000, 1000);
      await device.purge(FTDI.FT_PURGE_RX);
      await device.setBaudRate(9600);
      await device.setDataCharacteristics(FTDI.FT_BITS_8, FTDI.FT_STOP_BITS_1, FTDI.FT_PARITY_NONE);
    }

    await device.purge(FTDI.FT_PURGE_RX)
    let dataReq = await JSON.stringify(req.body)
    let dataWrite = await Buffer.alloc(dataReq.length, dataReq);
    await device.write(dataWrite);
    let response = await device.read(1024);
    response = await String.fromCharCode(...response);

    if (response != "" && response != null) {
      Data_FTDI.status = "success";
      Data_FTDI.error = "";
      res.send(200, Data_FTDI)
    } else {
      Data_FTDI.status = "fail";
      Data_FTDI.error = "can don't set config";
      res.send(200, Data_FTDI)
    }
  } catch (err) {
    Data_FTDI.status = "fail";
    Data_FTDI.error = err.message;
    res.send(500, Data_FTDI)
  }
}

exports.GetConfigModem = async function (req, res, next) {

  try {
    await exec('ifconfig', (error, stdout, stderr) => {
      if (error) {
        res.send(500, error.message);
        return;
      }
      if (stderr) {
        res.send(200, stderr);
        return;
      }
      if (stdout) {
        if (stdout.includes("192.168.1.1")) {
          res.send(200, { status: "on" });
        } else {
          res.send(200, { status: "off" });
        }
      }
    })
  }
  catch (err) {
    res.send(500, "err.message");
  }
}

exports.SetConfigModem = async function (req, res, next) {

  let Data_FTDI = {
    status: null,
    error: ""
  }

  try {
    //await exec(`systemctl stop lavender-update`, (error, stdout, stderr) => { if (error) { errMessage = error.message; console.log(error.message); return; } if (stderr) { console.log(stderr); return; } })
    await exec('rmmod ftdi_sio', (error, stdout, stderr) => { if (error) { errMessage = error.message; console.log(error.message); return; } if (stderr) { console.log(stderr); return; } })
    await exec('rmmod usbserial', (error, stdout, stderr) => { if (error) { errMessage = error.message; console.log(error.message); return; } if (stderr) { console.log(stderr); return; } })

    let deviceList = await FTDI.getDeviceInfoList();
    if (deviceList.find(d => d['description'] === 'LAV-FAN-CTRL') === undefined || deviceList.find(d => d['description'] === 'LAV-FAN-CTRL') === null) {
      Data_FTDI.error = "undefined";
      res.send(200, Data_FTDI)
      return;
    }

    serial_number = deviceList.find(d => d['description'] === 'LAV-FAN-CTRL').serial_number
    is_open = deviceList.find(d => d['description'] === 'LAV-FAN-CTRL').is_open
    if (is_open === false) {
      device = await FTDI.openDevice(serial_number);
      await device.setTimeouts(1000, 1000);
      await device.purge(FTDI.FT_PURGE_RX);
      await device.setBaudRate(9600);
      await device.setDataCharacteristics(FTDI.FT_BITS_8, FTDI.FT_STOP_BITS_1, FTDI.FT_PARITY_NONE);
    }

    await device.purge(FTDI.FT_PURGE_RX)
    let dataReq = await JSON.stringify(req.body)
    let dataWrite = await Buffer.alloc(dataReq.length, dataReq);
    await device.write(dataWrite);
    let response = await device.read(1024);
    response = await String.fromCharCode(...response);

    Data_FTDI.status = "success";
    Data_FTDI.error = "";
    res.send(200, Data_FTDI)

  } catch (err) {
    Data_FTDI.status = "fail";
    Data_FTDI.error = err.message;
    res.send(500, Data_FTDI)
  }
}
