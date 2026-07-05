const fs = require('fs')
const config = require('../config')
const Connectdb = config.dbSettings.pool;

module.exports.BackupDataFile = async () => {
    try {
        if (!fs.existsSync("/lavender/backupDB")) {
            if (fs.existsSync("/lavender")) {
                fs.mkdirSync("/lavender/backupDB");
            } else {
                fs.mkdirSync("/lavender");
                fs.mkdirSync("/lavender/backupDB");
            }
        }

        if (!fs.existsSync("/lavender/backupDB/AutoBackup.json")) {

            fs.createWriteStream(`/lavender/backupDB/AutoBackup.json`)

            let site_config = await getSitecConfig();
            let grades = await getGrades();
            let price_profiles = await getPriceProfiles();
            let tanks = await getTank();
            let loops = await getLoops();
            let pumps = await getPumps();
            let advances_setting = await Promise.all(((await getAdvancesSetting())).map(async (data, i) => {
                data.pts_parameter = JSON.stringify(data.pts_parameter)
                return Promise.resolve(data);
            }))
            let pumps_display = await getPumpsDisplay();
            let hoses = await getHoses();
            let tank_gauge_features = await getTankGaugeFeatures();
            let transactions = await getTransactions();
            let transactions_bk = await getTransactionsBK();
            let config_fleet_fraud = await getConfigFleetFraud();

            let transaction_id_Next = 0
            let maxTran = transactions.reduce((prev, current) => ((prev.transaction_id > current.transaction_id) ? prev.transaction_id : current.transaction_id), 0)
            let maxTranBK = transactions_bk.reduce((prev, current) => ((prev.transaction_id > current.transaction_id) ? prev.transaction_id : current.transaction_id), 0)
            if (transactions.rowCount === 0) {
                transaction_id_Next = maxTranBK
            } else {
                transaction_id_Next = Math.max(maxTran, maxTranBK)
            }
            let transactions_next_id = [{ transaction_id: transaction_id_Next + 1 }]

            let dataJson = {
                site_config, grades, price_profiles, tanks, loops, pumps, advances_setting, pumps_display,
                hoses, tank_gauge_features, transactions, transactions_next_id, transactions_bk, config_fleet_fraud
            }

            fs.writeFile("/lavender/backupDB/AutoBackup.json", JSON.stringify(dataJson, null, 2), err => {
                if (err) console.log("Error writing file:", err);
            });
        }
    } catch (err) {
        console.log(err)
        fs.rmSync("/lavender/backupDB/AutoBackup.json", { force: true })
    }
}

async function getSitecConfig() {
    try {
        const query = "select * from lavender.site_config ORDER BY config_id ASC";
        let resultQuery = await Connectdb.query(query);
        return resultQuery.rows;
    } catch (err) {
        return [];
    }
}

async function getGrades() {
    try {
        const query = "select * from lavender.grades ORDER BY grade_id ASC";
        let resultQuery = await Connectdb.query(query);
        return resultQuery.rows;
    } catch (err) {
        return [];
    }
}

async function getPriceProfiles() {
    try {
        const query = "select * from lavender.price_profiles ORDER BY profile_id ASC";
        let resultQuery = await Connectdb.query(query);
        return resultQuery.rows;
    } catch (err) {
        return [];
    }
}

async function getTank() {
    try {
        const query = "select * from lavender.tanks ORDER BY tank_id ASC";
        let resultQuery = await Connectdb.query(query);
        return resultQuery.rows;
    } catch (err) {
        return [];
    }
}

async function getLoops() {
    try {
        const query = "select * from lavender.loops ORDER BY loop_id ASC";
        let resultQuery = await Connectdb.query(query);
        return resultQuery.rows;
    } catch (err) {
        return [];
    }
}

async function getPumps() {
    try {
        const query = "select * from lavender.pumps ORDER BY pump_id ASC";
        let resultQuery = await Connectdb.query(query);
        return resultQuery.rows;
    } catch (err) {
        return [];
    }
}

async function getAdvancesSetting() {
    try {
        const query = "select * from lavender.advances_setting ORDER BY pump_id ASC";
        let resultQuery = await Connectdb.query(query);
        return resultQuery.rows;
    } catch (err) {
        return [];
    }
}

async function getPumpsDisplay() {
    try {
        const query = "select * from lavender.pumps_display ORDER BY display_id ASC";
        let resultQuery = await Connectdb.query(query);
        return resultQuery.rows;
    } catch (err) {
        return [];
    }
}

async function getHoses() {
    try {
        const query = "select * from lavender.hoses ORDER BY hose_id ASC";
        let resultQuery = await Connectdb.query(query);
        return resultQuery.rows;
    } catch (err) {
        return [];
    }
}

async function getTankGaugeFeatures() {
    try {
        const query = "select * from lavender.tank_gauge_features ORDER BY feature_id ASC";
        let resultQuery = await Connectdb.query(query);
        return resultQuery.rows;
    } catch (err) {
        return [];
    }
}

async function getTransactions() {
    try {
        const query = "select * from lavender.transactions ORDER BY transaction_id ASC";
        let resultQuery = await Connectdb.query(query);
        return resultQuery.rows;
    } catch (err) {
        return [];
    }
}

async function getTransactionsBK() {
    try {
        const query = "select * from lavender.transactions_bk where cleared_ts between (now() - INTERVAL '1 DAY') and now() ORDER BY transaction_id ASC";
        let resultQuery = await Connectdb.query(query);
        return resultQuery.rows;
    } catch (err) {
        return [];
    }
}

async function getConfigFleetFraud() {
    try {
        const query = "select * from lavender.config_fleet_fraud ORDER BY pump_id ASC";
        let resultQuery = await Connectdb.query(query);
        return resultQuery.rows;
    } catch (err) {
        return [];
    }
}