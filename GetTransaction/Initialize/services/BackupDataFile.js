const fs = require('fs')
const config = require('../config')
const Connectdb = config.dbSettings.pool;


module.exports.BackupDataFile = async () => {
try{

    if(!fs.existsSync("/lavender/backupDB")){
        if (fs.existsSync("/lavender")) {
        fs.mkdirSync("/lavender/backupDB");
        }else {
        fs.mkdirSync("/lavender");
        fs.mkdirSync("/lavender/backupDB");
        }
    }

    if(!fs.existsSync("/lavender/backupDB/AutoBackup.json")){

    fs.createWriteStream(`/lavender/backupDB/AutoBackup.json`)

    let querySiteConfig = await Connectdb.query(`select * from lavender.site_config ORDER BY config_id ASC`)

    let queryGrades = await Connectdb.query(`select * from lavender.grades ORDER BY grade_id ASC`)

    let queryPriceProfiles = await Connectdb.query(`select * from lavender.price_profiles ORDER BY profile_id ASC`)

    let queryTank = await Connectdb.query(`select * from lavender.tanks ORDER BY tank_id ASC`)

    let queryLoops = await Connectdb.query(`select * from lavender.loops ORDER BY loop_id ASC`)

    let queryPumps = await Connectdb.query(`select * from lavender.pumps ORDER BY pump_id ASC`)

    let queryAdvancesSetting = await Connectdb.query(`select * from lavender.advances_setting ORDER BY pump_id ASC`)

    let queryPumpsDisplay = await Connectdb.query(`select * from lavender.pumps_display ORDER BY display_id ASC`)

    let queryHoses = await Connectdb.query(`select * from lavender.hoses ORDER BY hose_id ASC`)

    let queryTankGaugeFeatures = await Connectdb.query(`select * from lavender.tank_gauge_features ORDER BY feature_id ASC`)

    let queryTransactions = await Connectdb.query(`select * from lavender.transactions ORDER BY transaction_id ASC`)

    let queryTransactionsBK = await Connectdb.query(`select * from lavender.transactions_bk where cleared_ts between (now() - INTERVAL '1 DAY') and now() ORDER BY transaction_id ASC`)

    let queryConfigFleetFraud = await Connectdb.query(`select * from lavender.config_fleet_fraud ORDER BY pump_id ASC`)


    let site_config = querySiteConfig.rows
    let grades = queryGrades.rows
    let price_profiles = queryPriceProfiles.rows
    let tanks = queryTank.rows
    let loops = queryLoops.rows
    let pumps = queryPumps.rows

    let advances_setting = await Promise.all(queryAdvancesSetting.rows.map(async (data, i) => {
        data.pts_parameter = JSON.stringify(data.pts_parameter)
        return Promise.resolve(data);
    }))

    let pumps_display = queryPumpsDisplay.rows
    let hoses = queryHoses.rows
    let tank_gauge_features = queryTankGaugeFeatures.rows
    let transactions = queryTransactions.rows
    let transactions_bk = queryTransactionsBK.rows
    let config_fleet_fraud = queryConfigFleetFraud.rows

    let transaction_id_Next = 0
    let maxTran = transactions.reduce((prev, current)=> ( (prev.transaction_id > current.transaction_id) ? prev.transaction_id : current.transaction_id),0)
    let maxTranBK = transactions_bk.reduce((prev, current)=> ( (prev.transaction_id > current.transaction_id) ? prev.transaction_id : current.transaction_id),0)
    if (queryTransactions.rowCount === 0){
        transaction_id_Next = maxTranBK
    }else{
        transaction_id_Next = Math.max(maxTran,maxTranBK)
    }
    let transactions_next_id = [{ transaction_id : transaction_id_Next + 1 }]

    let dataJson =  {site_config,grades,price_profiles,tanks,loops,pumps,advances_setting,pumps_display,
                    hoses,tank_gauge_features,transactions,transactions_next_id,transactions_bk,config_fleet_fraud}
                                    


    fs.writeFile("/lavender/backupDB/AutoBackup.json", JSON.stringify(dataJson, null, 2), err => {
        if (err) console.log("Error writing file:", err);
    });

    }

  }catch(err){
    console.log(err.messaeg)
  }
}

