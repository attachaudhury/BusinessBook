const mongoose = require('mongoose');
var tree = require('mongoose-mpath');
materializedPlugin = require('mongoose-materialized')
const category = mongoose.Schema({
    name:String
})
category.plugin(materializedPlugin);
module.exports = mongoose.model('category',category);
