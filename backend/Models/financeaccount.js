const mongoose = require('mongoose');
materializedPlugin = require('mongoose-materialized')
const financeaccount = mongoose.Schema({
    name:String,
    type:String,
})
financeaccount.plugin(materializedPlugin);
module.exports = mongoose.model('financeaccount',financeaccount,'financeaccount');
