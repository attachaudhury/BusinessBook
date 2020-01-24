const mongoose = require('mongoose');
var tree = require('mongoose-mpath');
materializedPlugin = require('mongoose-materialized')
const financetransaction = mongoose.Schema({
    amount:Number,
    createdata:{type:Date,default:Date.now()},
    description:String,
    financeaccount:{type:mongoose.Schema.ObjectId,ref:"financeaccount"},
    group:{type:mongoose.Schema.ObjectId,ref:"user"},
    others:[{key:String,value:String}],
    soldproducts:[{_id:{type:mongoose.Schema.ObjectId,ref:"product"},name:String,saleprice:Number,quantity:Number,total:Number}],
    status:String,
    user:{type:mongoose.Schema.ObjectId,ref:"user"},
})
module.exports = mongoose.model('financetransaction',financetransaction,'financetransaction');
