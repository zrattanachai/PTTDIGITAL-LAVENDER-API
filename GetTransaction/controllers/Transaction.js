const _ = require('lodash');
const moment = require("moment");
const numeral = require("numeral");
const auth = require("basic-auth");
const config = require("../config");
const gaia = require('../services/Gaia.js')
const ServiceLavender = require('../services/index.js')
const Connectdb = config.dbSettings.pool;

exports.TransactionByPumpID = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const Pump_id = req.body.pump_id
  const Startdate = req.body.startdate
  const Enddate = req.body.enddate
  let Log_Structure = {
    time_request: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
    ip_request: ip_request,
    terminal_id: terminal_id,
    request_body: req.body,
    request_params: req.params,
    response_StatusCode: "",
    response_data: "",
    time_response: "",
    api_error: false

  }
  if (!Pump_id || !Startdate || !Enddate) {
    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("TransactionByPumpID_", JSON.stringify(Log_Structure))
    res.send(400, message_response)
    return

  }
  try {
    try {
      const query = {
        text:
          "select transaction_id, pump_id, hose_id, price_level, completed_ts, cleared_ts" +
          ", delivery_type, delivery_volume, delivery_value, sell_price, cleared_by, reserved_by" +
          ", total_meter_volume, total_meter_value from lavender.transactions_bk " +
          "where pump_id = $1 and completed_ts between $2 and $3 order by transaction_id asc",
        values: [Pump_id, Startdate, Enddate]
      };

      let resultQuery = await Connectdb.query(query);
      if (resultQuery.rowCount > 0) {
        try {
          let resultResponse = await Promise.all(
            resultQuery.rows.map(async (data, i) => {
              data.completed_ts = moment(data.completed_ts)
                .local()
                .format("YYYY/MM/DD HH:mm:ss");
              if (data.cleared_ts === null || data.cleared_ts === "") {
                data.cleared_ts = null;
              } else {
                data.cleared_ts = moment(data.cleared_ts)
                  .local()
                  .format("YYYY/MM/DD HH:mm:ss");
              }
              return Promise.resolve(data);
            })
          );
          let message_response = { "message": "Response Data QTY : " + resultResponse.length + " record" }
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 200,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("TransactionByPumpID_", JSON.stringify(Log_Structure))
          res.send(200, resultResponse)
          return
        } catch (err) {
          Log_Structure.response_data = { "message": err.message };
          Log_Structure.response_StatusCode = 500,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          Log_Structure.api_error = true
          ServiceLavender.ServiceLog.WriteLog("TransactionByPumpID_", JSON.stringify(Log_Structure))
          res.send(500, { "message": err.message })
          return;
        }
      } else {
        let message_response = { "message": "Result not found." }
        Log_Structure.response_data = message_response;
        Log_Structure.response_StatusCode = 212,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        ServiceLavender.ServiceLog.WriteLog("TransactionByPumpID_", JSON.stringify(Log_Structure))
        res.send(212, message_response)
        return
      }
    } catch (err) {
      Log_Structure.response_data = { "message": err.message };
      Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      Log_Structure.api_error = true
      ServiceLavender.ServiceLog.WriteLog("TransactionByPumpID_", JSON.stringify(Log_Structure))
      res.send(500, { "message": err.message })
      return;
    }

  } catch (err) {
    Log_Structure.response_data = { "message": err.message };
    Log_Structure.response_StatusCode = 500,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    Log_Structure.api_error = true
    ServiceLavender.ServiceLog.WriteLog("TransactionByPumpID_", JSON.stringify(Log_Structure))
    res.send(500, { "message": err.message })
    return;
  }

};

exports.TransactionByHoseID = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const Hose_id = req.body.hose_id
  const Startdate = req.body.startdate
  const Enddate = req.body.enddate
  let Log_Structure = {
    time_request: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
    ip_request: ip_request,
    terminal_id: terminal_id,
    request_body: req.body,
    request_params: req.params,
    response_StatusCode: "",
    response_data: "",
    time_response: "",
    api_error: false

  }
  if (!Hose_id || !Startdate || !Enddate) {
    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("TransactionByHoseID_", JSON.stringify(Log_Structure))
    res.send(400, message_response)
    return

  }

  try {
    try {
      const query = {
        text:
          "select transaction_id, pump_id, hose_id, price_level, completed_ts, cleared_ts" +
          ", delivery_type, delivery_volume, delivery_value, sell_price, cleared_by, reserved_by" +
          ", total_meter_volume, total_meter_value from lavender.transactions_bk " +
          "where hose_id = $1 and completed_ts between $2 and $3 order by transaction_id asc",
        values: [Hose_id, Startdate, Enddate]
      };

      let resultQuery = await Connectdb.query(query);
      if (resultQuery.rowCount > 0) {
        try {
          let resultResponse = await Promise.all(
            resultQuery.rows.map(async (data, i) => {
              data.completed_ts = moment(data.completed_ts)
                .local()
                .format("YYYY/MM/DD HH:mm:ss");
              if (data.cleared_ts === null || data.cleared_ts === "") {
                data.cleared_ts = null;
              } else {
                data.cleared_ts = moment(data.cleared_ts)
                  .local()
                  .format("YYYY/MM/DD HH:mm:ss");
              }
              return Promise.resolve(data);
            })
          );
          let message_response = { "message": "Response Data QTY : " + resultResponse.length + " record" }
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 200,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("TransactionByHoseID_", JSON.stringify(Log_Structure))
          res.send(200, resultResponse)
          return;
        } catch (err) {
          Log_Structure.response_data = { "message": err.message };
          Log_Structure.response_StatusCode = 500,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("TransactionByHoseID_", JSON.stringify(Log_Structure))
          res.send(500, { "message": err.message })
          return;
        }
      } else {
        let message_response = { "message": "Result not found." }
        Log_Structure.response_data = message_response;
        Log_Structure.response_StatusCode = 212,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        ServiceLavender.ServiceLog.WriteLog("TransactionByHoseID_", JSON.stringify(Log_Structure))
        res.send(212, message_response)
        return
      }
    } catch (err) {
      Log_Structure.response_data = { "message": err.message };
      Log_Structure.response_StatusCode = 500,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      Log_Structure.api_error = true
      ServiceLavender.ServiceLog.WriteLog("TransactionByHoseID_", JSON.stringify(Log_Structure))
      res.send(500, { "message": err.message })
      return;
    }
  } catch (err) {
    Log_Structure.response_data = { "message": err.message };
    Log_Structure.response_StatusCode = 500,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    Log_Structure.api_error = true
    ServiceLavender.ServiceLog.WriteLog("TransactionByHoseID_", JSON.stringify(Log_Structure))
    res.send(500, { "message": err.message })
    return;
  }
};

exports.TransactionSpecificDate = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const Startdate = req.body.startdate
  const Enddate = req.body.enddate
  let Log_Structure = {
    time_request: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
    ip_request: ip_request,
    terminal_id: terminal_id,
    request_body: req.body,
    request_params: req.params,
    response_StatusCode: "",
    response_data: "",
    time_response: "",
    api_error: false

  }
  if (!Startdate || !Enddate) {
    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("TransactionSpecificDate_", JSON.stringify(Log_Structure))
    res.send(400, message_response)
    return

  }

  try {



    try {
      const query = {
        text:
          "select transaction_id, pump_id, hose_id, price_level, completed_ts, cleared_ts" +
          ", delivery_type, delivery_volume, delivery_value, sell_price, cleared_by, reserved_by" +
          ", total_meter_volume, total_meter_value from lavender.transactions_bk " +
          "where completed_ts between $1 and $2 order by transaction_id asc",
        values: [Startdate, Enddate]
      };

      let resultQuery = await Connectdb.query(query);
      if (resultQuery.rowCount > 0) {
        try {
          let resultResponse = await Promise.all(
            resultQuery.rows.map(async (data, i) => {
              data.completed_ts = moment(data.completed_ts)
                .local()
                .format("YYYY/MM/DD HH:mm:ss");
              if (data.cleared_ts === null || data.cleared_ts === "") {
                data.cleared_ts = null;
              } else {
                data.cleared_ts = moment(data.cleared_ts)
                  .local()
                  .format("YYYY/MM/DD HH:mm:ss");
              }
              return Promise.resolve(data);
            })
          );
          let message_response = { "message": "Response Data QTY : " + resultResponse.length + " record" }
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 200,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("TransactionSpecificDate_", JSON.stringify(Log_Structure))
          res.send(200, resultResponse)
          return;
        } catch (err) {
          Log_Structure.response_data = { "message": err.message };
          Log_Structure.response_StatusCode = 500,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("TransactionSpecificDate_", JSON.stringify(Log_Structure))
          res.send(500, { "message": err.message })
          return;
        }
      } else {
        let message_response = { "message": "Result not found." }
        Log_Structure.response_data = message_response;
        Log_Structure.response_StatusCode = 212,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        ServiceLavender.ServiceLog.WriteLog("TransactionSpecificDate_", JSON.stringify(Log_Structure))
        res.send(212, message_response)
        return
      }
    } catch (err) {
      Log_Structure.response_data = { "message": err.message };
      Log_Structure.response_StatusCode = 500,
        Log_Structure.api_error = true
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      ServiceLavender.ServiceLog.WriteLog("TransactionSpecificDate_", JSON.stringify(Log_Structure))
      res.send(500, { "message": err.message })
      return;

    }

  } catch (err) {
    Log_Structure.response_data = { "message": err.message };
    Log_Structure.response_StatusCode = 500,
      Log_Structure.api_error = true
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("TransactionSpecificDate_", JSON.stringify(Log_Structure))
    res.send(500, { "message": err.message })
    return;
  }
};

exports.CurrentTransaction = async function (req, res, next) {

  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const Pump_id = req.params.pump_id
  let Log_Structure = {
    time_request: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
    ip_request: ip_request,
    terminal_id: terminal_id,
    request_body: req.body,
    request_params: req.params,
    response_StatusCode: "",
    response_data: "",
    time_response: "",
    api_error: false

  }
  if (!Pump_id) {
    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("CurrentTransaction_", JSON.stringify(Log_Structure))
    res.send(400, message_response)
    return

  }


  try {

    try {

      const query = {
        text:
          "select transaction_id, pump_id, hose_id, price_level, completed_ts, cleared_ts" +
          ", delivery_type, delivery_volume, delivery_value, sell_price, cleared_by, reserved_by" +
          ", total_meter_volume, total_meter_value from lavender.transactions " +
          "where pump_id = $1 and delivery_type = 1 order by transaction_id asc",
        values: [Number(Pump_id)]
      };

      let resultQuery = await Connectdb.query(query);

      if (resultQuery.rowCount > 0) {
        try {
          let resultResponse = await Promise.all(
            resultQuery.rows.map(async (data, i) => {
              data.completed_ts = moment(data.completed_ts)
                .local()
                .format("YYYY/MM/DD HH:mm:ss");
              if (data.cleared_ts === null) {
                data.cleared_ts = null;
              } else {
                data.cleared_ts = moment(data.cleared_ts)
                  .local()
                  .format("YYYY/MM/DD HH:mm:ss");
              }
              return Promise.resolve(data);
            })
          );
          let message_response = { "message": "Response Data QTY : " + resultResponse.length + " record" }
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 200,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("CurrentTransaction_", JSON.stringify(Log_Structure))
          res.send(200, resultResponse)
          return
        } catch (err) {
          Log_Structure.response_data = { "message": err.message };
          Log_Structure.response_StatusCode = 500,
            Log_Structure.api_error = true
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("CurrentTransaction_", JSON.stringify(Log_Structure))
          res.send(500, { "message": err.message })

        }
      } else {
        let message_response = { "message": "Result not found." }
        Log_Structure.response_data = message_response;
        Log_Structure.response_StatusCode = 212,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        ServiceLavender.ServiceLog.WriteLog("CurrentTransaction_", JSON.stringify(Log_Structure))
        res.send(212, message_response)
        return
      }
    } catch (err) {
      Log_Structure.response_data = { "message": err.message };
      Log_Structure.response_StatusCode = 500,
        Log_Structure.api_error = true
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      ServiceLavender.ServiceLog.WriteLog("CurrentTransaction_", JSON.stringify(Log_Structure))
      res.send(500, { "message": err.message })
      return
    }

  } catch (err) {
    Log_Structure.response_data = { "message": err.message };
    Log_Structure.response_StatusCode = 500,
      Log_Structure.api_error = true
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("CurrentTransaction_", JSON.stringify(Log_Structure))
    res.send(500, { "message": err.message })
    return
  }
};

exports.StackTransaction = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const Pump_id = req.params.pump_id
  let Log_Structure = {
    time_request: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
    ip_request: ip_request,
    terminal_id: terminal_id,
    request_body: req.body,
    request_params: req.params,
    response_StatusCode: "",
    response_data: "",
    time_response: "",
    api_error: false

  }
  if (!Pump_id) {
    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("StackTransaction_", JSON.stringify(Log_Structure))
    res.send(400, message_response)
    return

  }

  try {

    try {
      const query = {
        text:
          "select transaction_id, pump_id, hose_id, price_level, completed_ts, cleared_ts" +
          ", delivery_type, delivery_volume, delivery_value, sell_price, cleared_by, reserved_by" +
          ", total_meter_volume, total_meter_value from lavender.transactions " +
          "where pump_id = $1 and delivery_type = 2 order by transaction_id asc",
        values: [Pump_id]
      };

      let resultQuery = await Connectdb.query(query);

      if (resultQuery.rowCount > 0) {
        try {
          let resultResponse = await Promise.all(
            resultQuery.rows.map(async (data, i) => {
              data.completed_ts = moment(data.completed_ts)
                .local()
                .format("YYYY/MM/DD HH:mm:ss");
              data.event_code = 3;
              data.event_description = "Delivery_Stack";
              if (data.cleared_ts === null) {
                data.cleared_ts = null;
              } else {
                data.cleared_ts = moment(data.cleared_ts)
                  .local()
                  .format("YYYY/MM/DD HH:mm:ss");
              }
              return Promise.resolve(data);
            })
          );
          let message_response = { "message": "Response Data QTY : " + resultResponse.length + " record" }
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 200,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("StackTransaction_", JSON.stringify(Log_Structure))
          res.send(200, resultResponse)
          return
        } catch (err) {
          Log_Structure.response_data = { "message": err.message };
          Log_Structure.response_StatusCode = 500,
            Log_Structure.api_error = true
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("StackTransaction_", JSON.stringify(Log_Structure))
          res.send(500, { "message": err.message })
          return
        }
      } else {
        let message_response = { "message": "Result not found." }
        Log_Structure.response_data = message_response;
        Log_Structure.response_StatusCode = 212,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        ServiceLavender.ServiceLog.WriteLog("StackTransaction_", JSON.stringify(Log_Structure))
        res.send(212, message_response)
        return
      }
    } catch (err) {
      Log_Structure.response_data = { "message": err.message };
      Log_Structure.response_StatusCode = 500,
        Log_Structure.api_error = true
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      ServiceLavender.ServiceLog.WriteLog("StackTransaction_", JSON.stringify(Log_Structure))
      res.send(500, { "message": err.message })
      return
    }

  } catch (err) {
    Log_Structure.response_data = { "message": err.message };
    Log_Structure.response_StatusCode = 500,
      Log_Structure.api_error = true
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("StackTransaction_", JSON.stringify(Log_Structure))
    res.send(500, { "message": err.message })
    return
  }

};

exports.OfflineTransaction = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const Pump_id = req.params.pump_id
  let Log_Structure = {
    time_request: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
    ip_request: ip_request,
    terminal_id: terminal_id,
    request_body: req.body,
    request_params: req.params,
    response_StatusCode: "",
    response_data: "",
    time_response: "",
    api_error: false

  }
  if (!Pump_id) {
    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("OfflineTransaction_", JSON.stringify(Log_Structure))
    res.send(400, message_response)
    return

  }
  try {



    try {
      const query = {
        text:
          "select transaction_id, pump_id, hose_id, price_level, completed_ts, cleared_ts" +
          ", delivery_type, delivery_volume, delivery_value, sell_price, cleared_by, reserved_by" +
          ", total_meter_volume, total_meter_value from lavender.transactions " +
          "where pump_id = $1 and delivery_type in (14,15,16) order by transaction_id asc",
        values: [Pump_id]
      };

      let resultQuery = await Connectdb.query(query);

      if (resultQuery.rowCount > 0) {
        try {
          let resultResponse = await Promise.all(
            resultQuery.rows.map(async (data, i) => {
              data.completed_ts = moment(data.completed_ts)
                .local()
                .format("YYYY/MM/DD HH:mm:ss");
              if (data.cleared_ts === null) {
                data.cleared_ts = null;
              } else {
                data.cleared_ts = moment(data.cleared_ts)
                  .local()
                  .format("YYYY/MM/DD HH:mm:ss");
              }
              return Promise.resolve(data);
            })
          );
          let message_response = { "message": "Response Data QTY : " + resultResponse.length + " record" }
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 200,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("OfflineTransaction_", JSON.stringify(Log_Structure))
          res.send(200, resultResponse)
          return
        } catch (err) {
          Log_Structure.response_data = { "message": err.message };
          Log_Structure.response_StatusCode = 500,
            Log_Structure.api_error = true
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("OfflineTransaction_", JSON.stringify(Log_Structure))
          res.send(500, { "message": err.message })
          return
        }
      } else {
        let message_response = { "message": "Result not found." }
        Log_Structure.response_data = message_response;
        Log_Structure.response_StatusCode = 212,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        ServiceLavender.ServiceLog.WriteLog("OfflineTransaction_", JSON.stringify(Log_Structure))
        res.send(212, message_response)
        return
      }
    } catch (err) {
      Log_Structure.response_data = { "message": err.message };
      Log_Structure.response_StatusCode = 500,
        Log_Structure.api_error = true
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      ServiceLavender.ServiceLog.WriteLog("OfflineTransaction_", JSON.stringify(Log_Structure))
      res.send(500, { "message": err.message })
      return
    }

  } catch (err) {
    Log_Structure.response_data = { "message": err.message };
    Log_Structure.response_StatusCode = 500,
      Log_Structure.api_error = true
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("OfflineTransaction_", JSON.stringify(Log_Structure))
    res.send(500, { "message": err.message })
    return
  }
};

exports.AllOfflineTransaction = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  let Log_Structure = {
    time_request: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
    ip_request: ip_request,
    terminal_id: terminal_id,
    request_body: req.body,
    request_params: req.params,
    response_StatusCode: "",
    response_data: "",
    time_response: "",
    api_error: false

  }

  try {

    try {
      const query = {
        text:
          "select transaction_id, pump_id, hose_id, price_level, completed_ts, cleared_ts" +
          ", delivery_type, delivery_volume, delivery_value, sell_price, cleared_by, reserved_by" +
          ", total_meter_volume, total_meter_value from lavender.transactions " +
          "where delivery_type in (14,15,16) order by transaction_id asc"
      };

      let resultQuery = await Connectdb.query(query);

      if (resultQuery.rowCount > 0) {
        try {
          let resultResponse = await Promise.all(
            resultQuery.rows.map(async (data, i) => {
              data.completed_ts = moment(data.completed_ts)
                .local()
                .format("YYYY/MM/DD HH:mm:ss");
              if (data.cleared_ts === null) {
                data.cleared_ts = null;
              } else {
                data.cleared_ts = moment(data.cleared_ts)
                  .local()
                  .format("YYYY/MM/DD HH:mm:ss");
              }
              return Promise.resolve(data);
            })
          );
          let message_response = { "message": "Response Data QTY : " + resultResponse.length + " record" }
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 200,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("AllOfflineTransaction_", JSON.stringify(Log_Structure))
          res.send(200, resultResponse)
          return

        } catch (err) {
          Log_Structure.response_data = { "message": err.message };
          Log_Structure.response_StatusCode = 500,
            Log_Structure.api_error = true
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("AllOfflineTransaction_", JSON.stringify(Log_Structure))
          res.send(500, { "message": err.message })
          return
        }
      }
      else {
        let message_response = { "message": "Result not found." }
        Log_Structure.response_data = message_response;
        Log_Structure.response_StatusCode = 212,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        ServiceLavender.ServiceLog.WriteLog("AllOfflineTransaction_", JSON.stringify(Log_Structure))
        res.send(212, message_response)
        return
      }
    } catch (err) {
      Log_Structure.response_data = { "message": err.message };
      Log_Structure.response_StatusCode = 500,
        Log_Structure.api_error = true
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      ServiceLavender.ServiceLog.WriteLog("AllOfflineTransaction_", JSON.stringify(Log_Structure))
      res.send(500, { "message": err.message })
      return
    }

  } catch (err) {
    Log_Structure.response_data = { "message": err.message };
    Log_Structure.response_StatusCode = 500,
      Log_Structure.api_error = true
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("AllOfflineTransaction_", JSON.stringify(Log_Structure))
    res.send(500, { "message": err.message })
    return
  }
};

exports.PushStack = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const Terminal_id_require = req.body.terminal_id
  const Transaction_id = req.body.transaction_id
  let Log_Structure = {
    time_request: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
    ip_request: ip_request,
    terminal_id: terminal_id,
    request_body: req.body,
    request_params: req.params,
    response_StatusCode: "",
    response_data: "",
    time_response: "",
    api_error: false

  }
  if (!Terminal_id_require || !Transaction_id) {
    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("PushStack_", JSON.stringify(Log_Structure))
    res.send(400, message_response)
    return

  }
  try {

    const query = {
      text:
        "update lavender.transactions set delivery_type = 2 where delivery_type = 1 and transaction_id = $1",
      values: [Number(Transaction_id)]
    };
    let getPump = await Connectdb.query("SELECT pump_id FROM lavender.transactions WHERE transaction_id = " + Transaction_id + "");

    if (getPump.rowCount !== 0) {
      let checkStack = await Connectdb.query("SELECT * FROM lavender.transactions WHERE delivery_type = 2 AND pump_id = " + getPump.rows[0].pump_id + "");
      let getMaxStack = await Connectdb.query("SELECT stack_limit FROM lavender.pumps where pump_id = " + getPump.rows[0].pump_id + "")
      if (checkStack.rowCount < getMaxStack.rows[0].stack_limit) {
        //if(req.body.terminal_id == 98){
        await Connectdb.query("BEGIN;");
        let resultQuery = await Connectdb.query(query);
        await Connectdb.query("COMMIT");
        if (resultQuery.rowCount === 1) {

          let message_response = { "message": "PushStack Transaction_ID : " + Transaction_id + " is success." }
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 200,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("PushStack_", JSON.stringify(Log_Structure))
          ServiceLavender.ServiceBackUp.BackupData([{ tableName: "transactions", transaction_id: Transaction_id }])
          res.send(200, message_response)
          return
        } else {
          let message_response = { message: "Cannot Push to Stack while Transaction is not Current type." }
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 211,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("PushStack_", JSON.stringify(Log_Structure))
          res.send(211, message_response)
          return
        }
        /*}
        else{
          res.send(200, { message: "Terminal id : "+req.body.terminal_id+" no permission to PushStack." });
    
          nowdatetime = await getdatetime_now();
          logger.write(' ' + nowdatetime + ' 200' + ' Terminal id : '+req.body.terminal_id+' no permission to PushStack.\r\n')
          sendMsg += ' ' + nowdatetime + ' ' + '200' + ' ' + ' Terminal id : '+req.body.terminal_id+' no permission to PushStack.\r\n'
        }*/
      }
      else {
        let message_response = { message: "Cannot Push to Stack while Transaction Stack is limited." }
        Log_Structure.response_data = message_response;
        Log_Structure.response_StatusCode = 213,
          Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        ServiceLavender.ServiceLog.WriteLog("PushStack_", JSON.stringify(Log_Structure))
        res.send(213, message_response)
        return
      }
    }
    else {
      let message_response = { message: "Can't Find Transaction : " + Transaction_id }
      Log_Structure.response_data = message_response;
      Log_Structure.response_StatusCode = 400,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      ServiceLavender.ServiceLog.WriteLog("PushStack_", JSON.stringify(Log_Structure))
      res.send(400, message_response)
      return
    }

  } catch (err) {
    Log_Structure.response_data = { "message": err.message };
    Log_Structure.response_StatusCode = 500,
      Log_Structure.api_error = true
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("PushStack_", JSON.stringify(Log_Structure))
    res.send(500, { "message": err.message })
    return
  }


};

exports.LockTransaction = async function (req, res, next) {

  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const Terminal_id_require = req.body.terminal_id
  const Transaction_id = req.body.transaction_id
  let Log_Structure = {
    time_request: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
    ip_request: ip_request,
    terminal_id: terminal_id,
    request_body: req.body,
    request_params: req.params,
    response_StatusCode: "",
    response_data: "",
    time_response: "",
    api_error: false

  }

  if (!Terminal_id_require || !Transaction_id) {

    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("LockTransaction_", JSON.stringify(Log_Structure))
    res.send(400, message_response)
    return

  }
  try {
    const query = {
      text:
        "update  lavender.transactions set reserved_by = $1 where transaction_id = $2 and reserved_by is null",
      values: [req.body.terminal_id, Number(req.body.transaction_id)]
    };

    let checkLock = await Connectdb.query('SELECT reserved_by FROM lavender.transactions WHERE transaction_id = ' + Transaction_id + 'AND reserved_by IS NOT NULL AND reserved_by NOT IN (-1, ' + Terminal_id_require + ')')
    if (checkLock.rowCount === 0) {
      try {
        await Connectdb.query("BEGIN;");
        let resultQuery = await Connectdb.query(query);
        await Connectdb.query("COMMIT;");
        if (resultQuery.rowCount === 1) {
          await Connectdb.query("BEGIN;");
          let resultQuery_again = await Connectdb.query(`update  lavender.transactions set reserved_by = ${Terminal_id_require} where transaction_id = ${Transaction_id}`);
          await Connectdb.query(`update  lavender.transactions set reserved_by = ${Terminal_id_require} where transaction_id = ${Transaction_id}`);
          await Connectdb.query("COMMIT;");
          if (resultQuery_again.rowCount === 1) {
            let Validate_Save_Locktransaction = await Connectdb.query(`select * from lavender.transactions  where transaction_id = ${Transaction_id}`)
            let message_response = { "message": "Locked Transaction_ID : " + Transaction_id + " is success." }
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 200,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.query = query
            Log_Structure.Validate_Save = Validate_Save_Locktransaction.rows[0]
            ServiceLavender.ServiceLog.WriteLog("LockTransaction_", JSON.stringify(Log_Structure))
            res.send(200, message_response)
            return
          } else {
            let message_response = { "message": "Can't Locked Transaction_ID : " + Transaction_id }
            Log_Structure.response_data = message_response;
            Log_Structure.response_StatusCode = 211,
              Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            Log_Structure.query = { "query": `update  lavender.transactions set reserved_by = ${req.body.terminal_id} where transaction_id = ${Number(req.body.transaction_id)} and reserved_by is null` }
            ServiceLavender.ServiceLog.WriteLog("LockTransaction_", JSON.stringify(Log_Structure))
            res.send(211, message_response)
            return
          }
        } else {
          let message_response = { "message": "Can't Locked Transaction_ID : " + Transaction_id }
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 211,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          Log_Structure.query = { "query": `update  lavender.transactions set reserved_by = ${req.body.terminal_id} where transaction_id = ${Number(req.body.transaction_id)} and reserved_by is null` }
          ServiceLavender.ServiceLog.WriteLog("LockTransaction_", JSON.stringify(Log_Structure))
          res.send(211, message_response)
          return
        }
      } catch (err) {
        Log_Structure.response_data = { "message": "Error Locked Transaction ID :" + Transaction_id + "-->" + err.message };
        Log_Structure.response_StatusCode = 500,
          Log_Structure.api_error = true
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        ServiceLavender.ServiceLog.WriteLog("LockTransaction_", JSON.stringify(Log_Structure))
        res.send(500, { "message": err.message })
        return
      }
    }
    else {
      let message_response = { "message": "Cannot Lock Transaction while other device is Locked." }
      Log_Structure.response_data = message_response;
      Log_Structure.response_StatusCode = 214,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      ServiceLavender.ServiceLog.WriteLog("LockTransaction_", JSON.stringify(Log_Structure))
      res.send(214, message_response)
      return
    }
  } catch (err) {
    Log_Structure.response_data = { "message": err.message };
    Log_Structure.response_StatusCode = 500,
      Log_Structure.api_error = true
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("LockTransaction_", JSON.stringify(Log_Structure))
    res.send(500, { "message": err.message })
    return
  }

};

exports.ReleaseTransaction = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const Terminal_id_require = req.body.terminal_id
  const Transaction_id = req.body.transaction_id
  let Log_Structure = {
    time_request: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
    ip_request: ip_request,
    terminal_id: terminal_id,
    request_body: req.body,
    request_params: req.params,
    response_StatusCode: "",
    response_data: "",
    time_response: "",
    api_error: false

  }
  if (!Terminal_id_require || !Transaction_id) {

    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("ReleaseTransaction_", JSON.stringify(Log_Structure))
    res.send(400, message_response)
    return

  }
  try {
    const query = {
      text:
        "update  lavender.transactions set reserved_by = null where transaction_id = $2 and reserved_by = $1",
      values: [req.body.terminal_id, Number(req.body.transaction_id)]
    };

    let checkRelease = await Connectdb.query('SELECT reserved_by FROM lavender.transactions WHERE transaction_id = ' + Transaction_id + 'AND reserved_by IS NOT NULL AND reserved_by NOT IN (-1, ' + Terminal_id_require + ')')
    if (checkRelease.rowCount === 0) {
      try {
        await Connectdb.query("BEGIN;");
        let resultQuery = await Connectdb.query(query);
        await Connectdb.query("COMMIT;");
        if (resultQuery.rowCount === 1) {

          let message_response = { "message": "Release Transaction_ID : " + Transaction_id + " is success." }
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 200,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          Log_Structure.query = query
          ServiceLavender.ServiceLog.WriteLog("ReleaseTransaction_", JSON.stringify(Log_Structure))
          res.send(200, message_response)
          return
        } else {
          let Validate_Release = await Connectdb.query(`select * from lavender.transactions  where transaction_id = ${Transaction_id}`)

          let message_response = { "message": "Can't Release Transaction_ID : " + Transaction_id }
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 211,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          Log_Structure.query = { "query": `update  lavender.transactions set reserved_by = null where transaction_id = ${Number(req.body.transaction_id)} and reserved_by = ${req.body.terminal_id}` }
          Log_Structure.Validate_Release = Validate_Release.rows[0]
          ServiceLavender.ServiceLog.WriteLog("ReleaseTransaction_", JSON.stringify(Log_Structure))
          res.send(211, message_response)
          return
        }
      } catch (err) {
        Log_Structure.response_data = { "message": "Error Release Transaction ID " + Transaction_id + " --> " + err.message };
        Log_Structure.response_StatusCode = 500,
          Log_Structure.api_error = true
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        ServiceLavender.ServiceLog.WriteLog("ReleaseTransaction_", JSON.stringify(Log_Structure))
        res.send(500, { "message": err.message })
        return
      }

    }
    else {

      let message_response = { " message": "Cannot Release Transaction while other device is Locked." }
      Log_Structure.response_data = message_response;
      Log_Structure.response_StatusCode = 215,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      ServiceLavender.ServiceLog.WriteLog("ReleaseTransaction_", JSON.stringify(Log_Structure))
      res.send(215, message_response)
      return
    }
  } catch (err) {
    Log_Structure.response_data = { "message": err.message };
    Log_Structure.response_StatusCode = 500,
      Log_Structure.api_error = true
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("ReleaseTransaction_", JSON.stringify(Log_Structure))
    res.send(500, { "message": err.message })
    return
  }

}

exports.ReleaseAllTransaction = async function (req, res, next) {

  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const Terminal_id_require = req.body.terminal_id
  let Log_Structure = {
    time_request: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
    ip_request: ip_request,
    terminal_id: terminal_id,
    request_body: req.body,
    request_params: req.params,
    response_StatusCode: "",
    response_data: "",
    time_response: "",
    api_error: false

  }
  if (!Terminal_id_require) {

    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("ReleaseAllTransaction_", JSON.stringify(Log_Structure))
    res.send(400, message_response)
    return

  }

  const query = {
    text:
      "update  lavender.transactions set reserved_by = null where reserved_by = $1",
    values: [Terminal_id_require]
  };
  try {
    let resultQuery = await Connectdb.query(query);
    if (resultQuery.rowCount > 0) {
      let message_response = { "message": "Release Total update rows : " + resultQuery.rowCount + " is success." }
      Log_Structure.response_data = message_response;
      Log_Structure.response_StatusCode = 200,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      ServiceLavender.ServiceLog.WriteLog("ReleaseAllTransaction_", JSON.stringify(Log_Structure))
      res.send(200, message_response)
      return
    } else {
      let message_response = { "message": "Can't Release Total" }
      Log_Structure.response_data = message_response;
      Log_Structure.response_StatusCode = 211,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      ServiceLavender.ServiceLog.WriteLog("ReleaseAllTransaction_", JSON.stringify(Log_Structure))
      res.send(211, message_response)
      return
    }
  } catch (err) {
    Log_Structure.response_data = { "message": err.message };
    Log_Structure.response_StatusCode = 500,
      Log_Structure.api_error = true
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("ReleaseAllTransaction_", JSON.stringify(Log_Structure))
    res.send(500, { "message": err.message })
    return
  }


};

exports.ClearPostPayTransaction = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const Terminal_id_require = req.body.terminal_id
  const Transaction_id = req.body.transaction_id
  let Log_Structure = {
    time_request: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
    ip_request: ip_request,
    terminal_id: terminal_id,
    request_body: req.body,
    request_params: req.params,
    response_StatusCode: "",
    response_data: "",
    time_response: "",
    api_error: false

  }
  if (!Terminal_id_require || !Transaction_id) {

    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("ClearPostPayTransaction_", JSON.stringify(Log_Structure))
    res.send(400, message_response)
    return

  }
  try {
    var hoseID, deliveryVolume, tankID, theoreticalVolume;
    let result = await Connectdb.query(
      "select * from lavender.transactions where transaction_id =" +
      Transaction_id +
      " and reserved_by = " +
      Terminal_id_require +
      ""
    );
    var transactionsOld = result;
    if (result.rowCount > 0) {
      try {
        hoseID = result.rows[0].hose_id;
        deliveryVolume = result.rows[0].delivery_volume;

        result = await Connectdb.query(
          "SELECT tank_id from lavender.hoses where hose_id = " +
          hoseID +
          ""
        );
       
        if (result.rowCount > 0) {
          try {
            tankID = result.rows[0].tank_id;
            result = await Connectdb.query(
              "SELECT theoretical_volume FROM lavender.tanks where tank_id = " +
              tankID +
              ""
            );
         
            if (result.rowCount > 0) {
              try {
                theoreticalVolume =
                  Number(result.rows[0].theoretical_volume) -
                  deliveryVolume;
                result = await Connectdb.query(
                  "update lavender.tanks set theoretical_volume = " +
                  theoreticalVolume +
                  " where tank_id = " +
                  tankID +
                  ""
                );

                let query = await Connectdb.query(
                  "update  lavender.transactions set delivery_type = 5,cleared_ts = now(), cleared_by = " +
                  Terminal_id_require +
                  ", reserved_by = -1" +
                  " where delivery_type in (1, 2, 14, 15, 16) and transaction_id = " +
                  Number(Transaction_id) +
                  " and reserved_by = " +
                  Terminal_id_require +
                  ""
                );

                if (query.rowCount !== 0) {
                  let DataTransaction = await Connectdb.query("select *  from lavender.transactions where transaction_id = " + Transaction_id + " ")
                  if (DataTransaction.rowCount > 0) {
                    await Connectdb.query("BEGIN;");
                    let status_backu_transaction = await Connectdb.query(`INSERT INTO lavender.transactions_bk(
                            transaction_id, pump_id, hose_id, price_level, completed_ts, cleared_ts, delivery_type, delivery_volume, delivery_value, sell_price, cleared_by, reserved_by, total_meter_volume, total_meter_value, sync_gaia, sync_backoffice)
                            VALUES (${DataTransaction.rows[0].transaction_id}, 
                              ${DataTransaction.rows[0].pump_id}, ${DataTransaction.rows[0].hose_id}, 
                              ${DataTransaction.rows[0].price_level}, '${moment(DataTransaction.rows[0].completed_ts).local().format('YYYY-MM-DD HH:mm:ss.ms')}', 
                              '${moment(DataTransaction.rows[0].cleared_ts).local().format('YYYY-MM-DD HH:mm:ss.ms')}', ${DataTransaction.rows[0].delivery_type}, 
                              ${DataTransaction.rows[0].delivery_volume}, ${DataTransaction.rows[0].delivery_value}, 
                              ${DataTransaction.rows[0].sell_price}, ${DataTransaction.rows[0].cleared_by}, 
                              ${DataTransaction.rows[0].reserved_by}, ${DataTransaction.rows[0].total_meter_volume}, 
                              ${DataTransaction.rows[0].total_meter_value}, ${DataTransaction.rows[0].sync_gaia}, 
                              ${DataTransaction.rows[0].sync_backoffice})`)
                    await Connectdb.query("COMMIT;");
                    if (status_backu_transaction.rowCount) {
                      await Connectdb.query("BEGIN;");
                      await Connectdb.query("delete from lavender.transactions where transaction_id = " + DataTransaction.rows[0].transaction_id + "")
                      await Connectdb.query("COMMIT;");
                      await gaia.socketProcess("ClearPostPay",transactionsOld,DataTransaction);
                    }
                    // await Connectdb.query("COMMIT");
                  }

                  let message_response = { "message": "ClearPostPay Transaction_id :" + Transaction_id + " is success." }
                  Log_Structure.response_data = message_response;
                  Log_Structure.response_StatusCode = 200,
                    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                  ServiceLavender.ServiceLog.WriteLog("ClearPostPayTransaction_", JSON.stringify(Log_Structure))
                  ServiceLavender.ServiceBackUp.BackupData([{ tableName: "transactions_bk", dataTransaction: DataTransaction },
                  { tableName: "tanks", tank_id: tankID, theoretical_volume: theoreticalVolume, condition: "theoretical_volume" }])
                  res.send(200, message_response)
                  return
                } else {
                  let message_response = { "message": "Can't ClearPostPay Transaction_id :" + Transaction_id + " is success." }
                  Log_Structure.response_data = message_response;
                  Log_Structure.response_StatusCode = 211,
                    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                  ServiceLavender.ServiceLog.WriteLog("ClearPostPayTransaction_", JSON.stringify(Log_Structure))
                  res.send(211, message_response)
                  return
                }
              } catch (err) {
                Log_Structure.response_data = { "message": err.message };
                Log_Structure.response_StatusCode = 500,
                  Log_Structure.api_error = true
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                ServiceLavender.ServiceLog.WriteLog("ClearPostPayTransaction_", JSON.stringify(Log_Structure))
                res.send(500, { "message": err.message })
                return;
              }
            } else {
              let message_response = { "message": "Can't Read Property Tank" }
              Log_Structure.response_data = message_response;
              Log_Structure.response_StatusCode = 211,
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              ServiceLavender.ServiceLog.WriteLog("ClearPostPayTransaction_", JSON.stringify(Log_Structure))
              res.send(211, message_response)
              return;
            }
          } catch (err) {
            Log_Structure.response_data = { "message": err.message };
            Log_Structure.response_StatusCode = 500,
              Log_Structure.api_error = true
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
            ServiceLavender.ServiceLog.WriteLog("ClearPostPayTransaction_", JSON.stringify(Log_Structure))
            res.send(500, { "message": err.message })
            return
          }
        } else {
          let message_response = { "message": "Can't Read Property Hose " }
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 211,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("ClearPostPayTransaction_", JSON.stringify(Log_Structure))
          res.send(211, message_response)
          return;
        }
      } catch (err) {
        Log_Structure.response_data = { "message": err.message };
        Log_Structure.response_StatusCode = 500,
          Log_Structure.api_error = true
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        ServiceLavender.ServiceLog.WriteLog("ClearPostPayTransaction_", JSON.stringify(Log_Structure))
        res.send(500, { "message": err.message })
        return
      }
    } else {
      let Validate_Save_Locktransaction = await Connectdb.query(`select * from lavender.transactions  where transaction_id = ${Transaction_id}`)
      let message_response = { "message": "Can't Find Transaction ID : " + Transaction_id }
      Log_Structure.response_data = message_response;
      Log_Structure.response_StatusCode = 400,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      Log_Structure.query = `select * from lavender.transactions where transaction_id = "${Transaction_id}" and reserved_by = "${Terminal_id_require}"`
      Log_Structure.Validate_canfind_Transaction = Validate_Save_Locktransaction.rows[0]
      ServiceLavender.ServiceLog.WriteLog("ClearPostPayTransaction_", JSON.stringify(Log_Structure))
      res.send(400, message_response)
      return;
    }
  } catch (err) {
    Log_Structure.response_data = { "message": err.message };
    Log_Structure.response_StatusCode = 500,
      Log_Structure.api_error = true
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("ClearPostPayTransaction_", JSON.stringify(Log_Structure))
    res.send(500, { "message": err.message })
    return;
  }
};

exports.ClearAllPostPayTransaction = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const Terminal_id_require = req.body.terminal_id
  const Transaction_id = req.body.transaction_id
  let Log_Structure = {
    time_request: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
    ip_request: ip_request,
    terminal_id: terminal_id,
    request_body: req.body,
    request_params: req.params,
    response_StatusCode: "",
    response_data: "",
    time_response: "",
    api_error: false

  }
  if (!Terminal_id_require || !Transaction_id) {

    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("ClearAllPostPayTransaction_", JSON.stringify(Log_Structure))
    res.send(400, message_response)
    return

  }
  try {
    let resultQuery = await Connectdb.query("SELECT * FROM lavender.transactions where delivery_type in (1, 2, 14, 15, 16) and reserved_by = " + Terminal_id_require + "");
    let dataArray = []
    if (resultQuery.rowCount > 0) {
      try {
        let resultResponse = await Promise.all(
          resultQuery.rows.map(async (data, i) => {
            let getTank = await Connectdb.query(
              "SELECT tank_id from lavender.hoses where hose_id = " +
              data.hose_id
            );
            if (getTank.rowCount > 0) {
              try {
                let tankID = getTank.rows[0].tank_id;
                let getVolume = await Connectdb.query(
                  "SELECT theoretical_volume FROM lavender.tanks where tank_id = " +
                  tankID
                );

                if (getVolume.rowCount > 0) {
                  try {
                    let theoreticalVolume =
                      Number(getVolume.rows[0].theoretical_volume) -
                      data.delivery_volume;
                    let resultTank = await Connectdb.query(
                      "update lavender.tanks set theoretical_volume = " +
                      theoreticalVolume +
                      " where tank_id = " +
                      tankID
                    );

                    let Update_status = await Connectdb.query(
                      "update  lavender.transactions set delivery_type = 5,cleared_ts = now(), cleared_by = " +
                      Terminal_id_require +
                      ", reserved_by = -1" +
                      " where delivery_type in (1, 2, 14, 15, 16) and transaction_id = " +
                      data.transaction_id +
                      " and reserved_by = " +
                      Terminal_id_require
                    );

                    if (Update_status.rowCount > 0) {
                      let DataTransaction = await Connectdb.query("select *  from lavender.transactions where transaction_id = " + data.transaction_id + " ")
                      if (DataTransaction.rowCount > 0) {
                        let status_backu_transaction = await Connectdb.query(`INSERT INTO lavender.transactions_bk(
                            transaction_id, pump_id, hose_id, price_level, completed_ts, cleared_ts, delivery_type, delivery_volume, delivery_value, sell_price, cleared_by, reserved_by, total_meter_volume, total_meter_value, sync_gaia, sync_backoffice)
                            VALUES (${DataTransaction.rows[0].transaction_id}, 
                              ${DataTransaction.rows[0].pump_id}, ${DataTransaction.rows[0].hose_id}, 
                              ${DataTransaction.rows[0].price_level}, '${moment(DataTransaction.rows[0].completed_ts).local().format('YYYY-MM-DD HH:mm:ss.ms')}', 
                              '${moment(DataTransaction.rows[0].cleared_ts).local().format('YYYY-MM-DD HH:mm:ss.ms')}', ${DataTransaction.rows[0].delivery_type}, 
                              ${DataTransaction.rows[0].delivery_volume}, ${DataTransaction.rows[0].delivery_value}, 
                              ${DataTransaction.rows[0].sell_price}, ${DataTransaction.rows[0].cleared_by}, 
                              ${DataTransaction.rows[0].reserved_by}, ${DataTransaction.rows[0].total_meter_volume}, 
                              ${DataTransaction.rows[0].total_meter_value}, ${DataTransaction.rows[0].sync_gaia}, 
                              ${DataTransaction.rows[0].sync_backoffice})`)

                        dataArray.push({ tableName: "transactions_bk", dataTransaction: DataTransaction })
                        dataArray.push({ tableName: "tanks", tank_id: tankID, theoretical_volume: theoreticalVolume, condition: "theoretical_volume" })

                        if (status_backu_transaction.rowCount) {
                          await Connectdb.query("delete from lavender.transactions where transaction_id = " + DataTransaction.rows[0].transaction_id + "")
                          await gaia.socketProcess("ClearAllPostPay",data,DataTransaction);
                        }
                      }
                    }
                  } catch (err) {
                    Log_Structure.response_data = { "message": err.messaeg }
                    Log_Structure.response_StatusCode = 500,
                      Log_Structure.api_error = true
                    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                    ServiceLavender.ServiceLog.WriteLog("ClearAllPostPayTransaction_", JSON.stringify(Log_Structure))
                  }
                } else {
                  let message_response = { "message": "Can't Read Property Tanks." }
                  Log_Structure.response_data = message_response;
                  Log_Structure.response_StatusCode = 211,
                    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                  ServiceLavender.ServiceLog.WriteLog("ClearAllPostPayTransaction_", JSON.stringify(Log_Structure))
                }
              } catch (err) {
                Log_Structure.response_data = { "message": err.messaeg }
                Log_Structure.response_StatusCode = 500,
                  Log_Structure.api_error = true
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                ServiceLavender.ServiceLog.WriteLog("ClearAllPostPayTransaction_", JSON.stringify(Log_Structure))
              }
            } else {
              let message_response = { "message": "Can't Read Property Hose." }
              Log_Structure.response_data = message_response;
              Log_Structure.response_StatusCode = 211,
                Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
              ServiceLavender.ServiceLog.WriteLog("ClearAllPostPayTransaction_", JSON.stringify(Log_Structure))
            }
            return Promise.resolve(data);
          })
        );
        if (resultResponse.length !== 0) {
          let message_response = { "message": "ClearPostPay Total update rows : " + resultResponse.length + " is success." }
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 200,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("ClearAllPostPayTransaction_", JSON.stringify(Log_Structure))
          ServiceLavender.ServiceBackUp.BackupData(dataArray)
          res.send(200, message_response)
          return
        } else {
          let message_response = { "message": "Can't ClearPostPay Total" }
          Log_Structure.response_data = message_response;
          Log_Structure.response_StatusCode = 211,
            Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
          ServiceLavender.ServiceLog.WriteLog("ClearAllPostPayTransaction_", JSON.stringify(Log_Structure))
          res.send(211, message_response)
          return
        }
      } catch (err) {
        let message_response = { "message": err.messaeg }
        Log_Structure.response_data = { "message": err.messaeg }
        Log_Structure.response_StatusCode = 500,
          Log_Structure.api_error = true
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
        ServiceLavender.ServiceLog.WriteLog("ClearAllPostPayTransaction_", JSON.stringify(Log_Structure))
        res.send(500, message_response)
        return
      }
    } else {
      let message_response = { "message": "Can't Read Transaction ID : " + Transaction_id }
      Log_Structure.response_data = message_response;
      Log_Structure.response_StatusCode = 400,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      ServiceLavender.ServiceLog.WriteLog("ClearAllPostPayTransaction_", JSON.stringify(Log_Structure))
      res.send(400, message_response)
      return
    }
  } catch (err) {
    let message_response = { "message": err.messaeg }
    Log_Structure.response_data = { "message": err.messaeg }
    Log_Structure.response_StatusCode = 500,
      Log_Structure.api_error = true
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("ClearAllPostPayTransaction_", JSON.stringify(Log_Structure))
    res.send(500, message_response)
    return
  }
};

exports.ClearTestTransaction = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const Terminal_id_require = req.body.terminal_id
  const Transaction_id = req.body.transaction_id
  let Log_Structure = {
    time_request: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
    ip_request: ip_request,
    terminal_id: terminal_id,
    request_body: req.body,
    request_params: req.params,
    response_StatusCode: "",
    response_data: "",
    time_response: "",
    api_error: false

  }
  if (!Terminal_id_require || !Transaction_id) {

    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("ClearTestTransaction_", JSON.stringify(Log_Structure))
    res.send(400, message_response)
    return

  }

  let result = await Connectdb.query(
    "select * from lavender.transactions where transaction_id =" +
    Transaction_id +
    " and reserved_by = " +
    Terminal_id_require +
    ""
  );
  var transactionsOld = result;

  const query = {
    text:
      "update  lavender.transactions set delivery_type = 11,cleared_ts = now(), cleared_by = $1, reserved_by = -1" +
      " where transaction_id = $2 and reserved_by = $1 and delivery_type in (1, 2, 14, 15, 16)",
    values: [Terminal_id_require, Number(Transaction_id)]
  };

  // need to calculate with tank inventory //
  try {
    let resultQuery = await Connectdb.query(query);
    if (resultQuery.rowCount === 1) {
      let DataTransaction = await Connectdb.query("select *  from lavender.transactions where transaction_id = " + Transaction_id + " ")
      if (DataTransaction.rowCount > 0) {
        let status_backu_transaction = await Connectdb.query(`INSERT INTO lavender.transactions_bk(
                transaction_id, pump_id, hose_id, price_level, completed_ts, cleared_ts, delivery_type, delivery_volume, delivery_value, sell_price, cleared_by, reserved_by, total_meter_volume, total_meter_value, sync_gaia, sync_backoffice)
                VALUES (${DataTransaction.rows[0].transaction_id}, 
                  ${DataTransaction.rows[0].pump_id}, ${DataTransaction.rows[0].hose_id}, 
                  ${DataTransaction.rows[0].price_level}, '${moment(DataTransaction.rows[0].completed_ts).local().format('YYYY-MM-DD HH:mm:ss.ms')}', 
                  '${moment(DataTransaction.rows[0].cleared_ts).local().format('YYYY-MM-DD HH:mm:ss.ms')}', ${DataTransaction.rows[0].delivery_type}, 
                  ${DataTransaction.rows[0].delivery_volume}, ${DataTransaction.rows[0].delivery_value}, 
                  ${DataTransaction.rows[0].sell_price}, ${DataTransaction.rows[0].cleared_by}, 
                  ${DataTransaction.rows[0].reserved_by}, ${DataTransaction.rows[0].total_meter_volume}, 
                  ${DataTransaction.rows[0].total_meter_value}, ${DataTransaction.rows[0].sync_gaia}, 
                  ${DataTransaction.rows[0].sync_backoffice})`)

        if (status_backu_transaction.rowCount) {
          await Connectdb.query("delete from lavender.transactions where transaction_id = " + DataTransaction.rows[0].transaction_id + "")
          await gaia.socketProcess("ClearTest",transactionsOld,DataTransaction);
        }
      }
      let message_response = { "message": "ClearTest Transaction_id : " + Terminal_id_require + " is success." }
      Log_Structure.response_data = message_response;
      Log_Structure.response_StatusCode = 200,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      ServiceLavender.ServiceLog.WriteLog("ClearTestTransaction_", JSON.stringify(Log_Structure))
      res.send(200, message_response)
      return
    } else {
      let message_response = { "message": "Can't Find  Transaction_id : " + Transaction_id + " & Terminal ID : " + Terminal_id_require + " in Lavender." }
      Log_Structure.response_data = message_response;
      Log_Structure.response_StatusCode = 211,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      ServiceLavender.ServiceLog.WriteLog("ClearTestTransaction_", JSON.stringify(Log_Structure))
      res.send(211, message_response)
      return
    }
  } catch (err) {
    let message_response = { "message": err.messaeg }
    Log_Structure.response_data = { "message": err.messaeg }
    Log_structure.response_StatusCode = 500
    Log_Structure.api_error = true
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("ClearTestTransaction_", JSON.stringify(Log_Structure))
    res.send(500, message_response)
    return
  }


};

exports.ClearAllTestTransaction = async function (req, res, next) {
  const ip_request = req.ip_request
  const terminal_id = req.terminal_id
  const Terminal_id_require = req.body.terminal_id
  let Log_Structure = {
    time_request: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
    ip_request: ip_request,
    terminal_id: terminal_id,
    request_body: req.body,
    request_params: req.params,
    response_StatusCode: "",
    response_data: "",
    time_response: "",
    api_error: false

  }
  if (!Terminal_id_require) {

    let message_response = { "message": "Incorrect Parameter or Parameter format." }
    Log_Structure.response_data = message_response;
    Log_Structure.response_StatusCode = 400,
      Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("ClearAllTestTransaction_", JSON.stringify(Log_Structure))
    res.send(400, message_response)
    return

  }
  let MasterDataTransaction = await Connectdb.query("select *  from lavender.transactions  where reserved_by = " + Terminal_id_require + " and delivery_type in (1, 2, 14, 15, 16) ")

  const query = {
    text:
      "update lavender.transactions set delivery_type = 11,cleared_ts = now(), cleared_by = $1, reserved_by = -1" +
      " where reserved_by = $1 and delivery_type in (1, 2, 14, 15, 16)",
    values: [Terminal_id_require]
  };
  // need to calculate with tank inventory //
  try {
    let resultQuery = await Connectdb.query(query);
    if (resultQuery.rowCount > 0) {
      await Promise.all(MasterDataTransaction.rows.map(async (Data) => {
        let DataTransaction = await Connectdb.query(`select *  from lavender.transactions  where transaction_id = ${Data.transaction_id}`)
        let status_backu_transaction = await Connectdb.query(`INSERT INTO lavender.transactions_bk(
                transaction_id, pump_id, hose_id, price_level, completed_ts, cleared_ts, delivery_type, delivery_volume, delivery_value, sell_price, cleared_by, reserved_by, total_meter_volume, total_meter_value, sync_gaia, sync_backoffice)
                VALUES (${DataTransaction.rows[0].transaction_id}, 
                  ${DataTransaction.rows[0].pump_id}, ${DataTransaction.rows[0].hose_id}, 
                  ${DataTransaction.rows[0].price_level}, '${moment(DataTransaction.rows[0].completed_ts).local().format('YYYY-MM-DD HH:mm:ss.ms')}', 
                  '${moment(DataTransaction.rows[0].cleared_ts).local().format('YYYY-MM-DD HH:mm:ss.ms')}', ${DataTransaction.rows[0].delivery_type}, 
                  ${DataTransaction.rows[0].delivery_volume}, ${DataTransaction.rows[0].delivery_value}, 
                  ${DataTransaction.rows[0].sell_price}, ${DataTransaction.rows[0].cleared_by}, 
                  ${DataTransaction.rows[0].reserved_by}, ${DataTransaction.rows[0].total_meter_volume}, 
                  ${DataTransaction.rows[0].total_meter_value}, ${DataTransaction.rows[0].sync_gaia}, 
                  ${DataTransaction.rows[0].sync_backoffice})`)
        if (status_backu_transaction.rowCount) {
          await Connectdb.query("delete from lavender.transactions where transaction_id = " + DataTransaction.rows[0].transaction_id + "")
          await gaia.socketProcess("ClearAllTest",Data,DataTransaction);
        }


        return DataTransaction
      }))

      await Connectdb.query("COMMIT");
      let message_response = { "message": "ClearTest Total update  QTY " + resultQuery.rowCount + " rows is success." }
      Log_Structure.response_data = message_response;
      Log_Structure.response_StatusCode = 200,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      ServiceLavender.ServiceLog.WriteLog("ClearAllTestTransaction_", JSON.stringify(Log_Structure))
      res.send(200, message_response)
      return
    } else {
      let message_response = { "message": "Can't Find Terminal ID : " + Terminal_id_require + " in Lavender." }
      Log_Structure.response_data = message_response;
      Log_Structure.response_StatusCode = 211,
        Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
      ServiceLavender.ServiceLog.WriteLog("ClearALLTestTransaction_", JSON.stringify(Log_Structure))
      res.send(211, message_response)
      return
    }
  } catch (err) {
    let message_response = { "message": err.messaeg }
    Log_Structure.response_data = { "message": err.messaeg }
    Log_Structure.response_StatusCode = 500,
      Log_Structure.api_error = true
    Log_Structure.time_response = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
    ServiceLavender.ServiceLog.WriteLog("ClearAllTestTransaction_", JSON.stringify(Log_Structure))
    res.send(500, message_response)
    return
  }


};

