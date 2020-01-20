const mongoose = require('mongoose');
const product = mongoose.Schema({
    barcode:{type:String},
    categories:[{type:String}],
    description:{type:String},
    images:[{type:String}],
    name:{type:String,required:true},
    purchaseprice:{type:Number},
    quantity:{type:Number,default:0},
    saleprice:{type:Number},
})
module.exports = mongoose.model('product',product,'product');
