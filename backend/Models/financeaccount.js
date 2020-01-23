const mongoose = require('mongoose');
var tree = require('mongoose-mpath');
materializedPlugin = require('mongoose-materialized')
const financeaccount = mongoose.Schema({
    name:String,
    type:String,
})
financeaccount.plugin(materializedPlugin);
module.exports = mongoose.model('financeaccount',financeaccount,'financeaccount');
