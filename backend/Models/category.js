const mongoose = require('mongoose');
var materializedPlugin = require('mongoose-materialized')
const category = mongoose.Schema({
    name:String
})
category.plugin(materializedPlugin);
module.exports = mongoose.model('category',category,'category');
