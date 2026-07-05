const config = require('../config')
const Defalut_Path = config.log_path
const fs = require('fs')
const moment = require('moment')
module.exports.WriteLog = (FileName,Message) => {
    return new Promise((resolve, reject) => {
        try {
      
            if (fs.existsSync("/lavender/log/api")) {
                if (!fs.existsSync(Defalut_Path)) {
                    fs.mkdirSync(Defalut_Path);
                }
            }else{
                if (fs.existsSync("/lavender/log")) {
                    fs.mkdirSync("/lavender/log/api");
                }else if(fs.existsSync("/lavender")){
                    fs.mkdirSync("/lavender/log");
                    fs.mkdirSync("/lavender/log/api");
                }else {
                    fs.mkdirSync("/lavender");
                    fs.mkdirSync("/lavender/log");
                    fs.mkdirSync("/lavender/log/api");
                } 
                    if (!fs.existsSync(Defalut_Path)) {
                    fs.mkdirSync(Defalut_Path);              
                }    
                }

            let Datatime = moment().startOf('hours').format('YYYY-MM-DD-HH')
            let file_name = `/${FileName}${Datatime}.txt`;

            var logger = fs.createWriteStream(`${Defalut_Path+file_name}`, {
                flags: 'a' // 'a' means appending (old data will be preserved)
            })
            logger.write(Message+"\r\n");
            resolve(true)
        } catch (err) {
            resolve(false)
        }

    })
}