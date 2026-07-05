const mongoose = require('mongoose');
  const DATA = new mongoose.Schema({
    site_code: String,
    tank_id: Number,
    product: String,
    volume: Number,
    trans_time: Date
})

module.exports = mongoose.model('DATA_Invertory', DATA,'DATA_Invertory')