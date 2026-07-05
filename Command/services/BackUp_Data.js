const config = require("../config");
const Connectdb = config.dbSettings.pool;
const BackupDataFile = require("./BackupDataFile.js")
const fs = require("fs");

module.exports.BackupData = async (dataTable) => {
  try {
    if (!fs.existsSync("/lavender/backupDB/AutoBackup.json")) {
      BackupDataFile.BackupDataFile()
    } else {
      var dataFile = fs.readFileSync('/lavender/backupDB/AutoBackup.json', 'utf8')
      var dataJson = JSON.parse(dataFile)

      await Promise.all(dataTable.map(async (data, i) => {
        var tableName = data.tableName

        if (tableName === "tanks") {
          if (data.condition == "theoretical_volume") {
            let tank_id = data.tank_id
            let theoretical_volume = data.theoretical_volume
            let indexTank = dataJson.tanks.findIndex(item => item.tank_id == tank_id)
            dataJson.tanks[indexTank].theoretical_volume = String(theoretical_volume)

          } else {
            let resultSearch = await Connectdb.query(`select * from lavender.tanks where tank_id = ${data.tank_id}`);
            if (resultSearch.rowCount !== 0) {
              let tank_id = resultSearch.rows[0].tank_id
              let indexTanks = dataJson.tanks.findIndex(item => item.tank_id == tank_id)
              if (indexTanks === -1) {
                dataJson.tanks.push(resultSearch.rows[0]);
              } else {
                dataJson.tanks.splice(indexTanks, 1, resultSearch.rows[0]);
              }
            }
          }
        } else if (tableName === "transactions") {
          let resultSearch = await Connectdb.query(`select * from lavender.transactions where transaction_id = ${data.transaction_id}`);
          let hose_id = resultSearch.rows[0].hose_id
          let total_meter_volume = resultSearch.rows[0].total_meter_volume
          let total_meter_value = resultSearch.rows[0].total_meter_value
          let indexHose = dataJson.hoses.findIndex(item => item.hose_id == hose_id)
          dataJson.hoses[indexHose].total_meter_volume = String(total_meter_volume)
          dataJson.hoses[indexHose].total_meter_value = String(total_meter_value)
          if (resultSearch.rowCount !== 0) {
            let transaction_id = resultSearch.rows[0].transaction_id
            let indexTransaction = dataJson.transactions.findIndex(item => item.transaction_id == transaction_id)
            if (indexTransaction === -1) {
              dataJson.transactions.push(resultSearch.rows[0]);
            } else {
              dataJson.transactions.splice(indexTransaction, 1, resultSearch.rows[0]);
            }
            if (transaction_id >= dataJson.transactions_next_id[0].transaction_id) {
              dataJson.transactions_next_id[0].transaction_id = transaction_id + 1
            }
          }
        } else if (tableName === "transactions_bk") {
          if (data.condition == "SetPosShift") {
            dataJson.transactions_bk = []
          } else {
            let transaction_id = data.dataTransaction.rows[0].transaction_id
            let indexTransaction_bk = dataJson.transactions_bk.findIndex(item => item.transaction_id == transaction_id)
            if (indexTransaction_bk === -1) {
              dataJson.transactions_bk.push(data.dataTransaction.rows[0]);
            } else {
              dataJson.transactions_bk.splice(indexTransaction_bk, 1, data.dataTransaction.rows[0]);
            }
            let indexTransaction = dataJson.transactions.findIndex(item => item.transaction_id == transaction_id)
            if (indexTransaction !== -1) {
              dataJson.transactions.splice(indexTransaction, 1);
            }
          }
        } else if (tableName === "pumps") {
          let resultSearch = await Connectdb.query(`select * from lavender.pumps where pump_id = ${data.pump_id}`);
          if (resultSearch.rowCount !== 0) {
            let pump_id = resultSearch.rows[0].pump_id
            let indexPump = dataJson.pumps.findIndex(item => item.pump_id == pump_id)
            if (indexPump === -1) {
              dataJson.pumps.push(resultSearch.rows[0]);
            } else {
              dataJson.pumps.splice(indexPump, 1, resultSearch.rows[0]);
            }
          }
        } else if (tableName === "price_profiles") {
          if (data.condition === "grade_id") {
            let resultSearch = await Connectdb.query(`select * from lavender.price_profiles where profile_id = '${data.profile_id}'`);
            if (resultSearch.rowCount !== 0) {
              let profile_id = resultSearch.rows[0].profile_id
              let indexPrice = dataJson.price_profiles.findIndex(item => item.profile_id == profile_id)
              if (indexPrice === -1) {
                dataJson.price_profiles.push(resultSearch.rows[0]);
              } else {
                dataJson.price_profiles.splice(indexPrice, 1, resultSearch.rows[0]);
              }
            }
          } else {
            let resultSearch = await Connectdb.query(`select * from lavender.price_profiles where profile_name = '${data.profile_name}'`);
            if (resultSearch.rowCount !== 0) {
              let profile_name = resultSearch.rows[0].profile_name
              let indexPrice = dataJson.price_profiles.findIndex(item => item.profile_name == profile_name)
              if (indexPrice === -1) {
                dataJson.price_profiles.push(resultSearch.rows[0]);
              } else {
                dataJson.price_profiles.splice(indexPrice, 1, resultSearch.rows[0]);
              }
            }
          }

        } else if (tableName === "grades") {
          if (data.condition === "grade_id") {
            let resultSearch = await Connectdb.query(`select * from lavender.grades where grade_id = '${data.grade_id}'`);
            if (resultSearch.rowCount !== 0) {
              let grade_id = resultSearch.rows[0].grade_id
              let indexGrade = dataJson.grades.findIndex(item => item.grade_id == grade_id)
              if (indexGrade === -1) {
                dataJson.grades.push(resultSearch.rows[0]);
              } else {
                dataJson.grades.splice(indexGrade, 1, resultSearch.rows[0]);
              }
            }
          } else {
            let resultSearch = await Connectdb.query(`select * from lavender.grades where grade_name = '${data.grade_name}'`);
            if (resultSearch.rowCount !== 0) {
              let grade_name = resultSearch.rows[0].grade_name
              let indexGrade = dataJson.grades.findIndex(item => item.grade_name == grade_name)
              if (indexGrade === -1) {
                dataJson.grades.push(resultSearch.rows[0]);
              } else {
                dataJson.grades.splice(indexGrade, 1, resultSearch.rows[0]);
              }
            }
          }
        } else if (tableName === "hoses") {
          if (data.condition === "tank") {
            let resultSearch = await Connectdb.query(`select * from lavender.hoses where tank_id = ${data.tank_id} `);
            if (resultSearch.rowCount !== 0) {
              await Promise.all(resultSearch.rows.map(async (data, i) => {
                let hose_id = data.hose_id
                let indexHose = dataJson.hoses.findIndex(item => item.hose_id == hose_id)
                if (indexHose === -1) {
                  dataJson.hoses.push(data);
                } else {
                  dataJson.hoses.splice(indexHose, 1, data);
                }
              }))
            }
          } else {
            let resultSearch = await Connectdb.query(`select * from lavender.hoses where pump_id = ${data.pump_id} and hose_number = ${data.hose_number}`);
            if (resultSearch.rowCount !== 0) {
              let pump_id = resultSearch.rows[0].pump_id
              let hose_number = resultSearch.rows[0].hose_number
              let indexHoses = dataJson.hoses.findIndex(item => item.pump_id == pump_id && item.hose_number == hose_number)
              if (indexHoses === -1) {
                dataJson.hoses.push(resultSearch.rows[0]);
              } else {
                dataJson.hoses.splice(indexHoses, 1, resultSearch.rows[0]);
              }
            }
          }
        } else if (tableName === "config_fleet_fraud") {
          let resultSearch = await Connectdb.query(`select * from lavender.config_fleet_fraud where pump_id = '${data.pump_id}'`);
          if (resultSearch.rowCount !== 0) {
            let pump_id = resultSearch.rows[0].pump_id
            let indexFleetFraud = dataJson.config_fleet_fraud.findIndex(item => item.pump_id == pump_id)
            if (indexFleetFraud === -1) {
              dataJson.config_fleet_fraud.push(resultSearch.rows[0]);
            } else {
              dataJson.config_fleet_fraud.splice(indexFleetFraud, 1, resultSearch.rows[0]);
            }
          } else if (data.condition === "delete") {
            let pump_id = data.pump_id
            let indexFleetFraud = dataJson.config_fleet_fraud.findIndex(item => item.pump_id == pump_id)
            dataJson.config_fleet_fraud.splice(indexFleetFraud, 1);
          }
        }
      }))
      fs.writeFile("/lavender/backupDB/AutoBackup.json", JSON.stringify(dataJson, null, 2), err => {
        if (err) {
          console.log("Error writing file:", err);
          fs.rmSync("/lavender/backupDB/AutoBackup.json", { force: true })
        }
      });
    }
  } catch (err) {
    console.log(err.messaeg)
    fs.rmSync("/lavender/backupDB/AutoBackup.json", { force: true });
    BackupDataFile.BackupDataFile()
  }
}
