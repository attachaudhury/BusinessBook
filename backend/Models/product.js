const mongoose = require('mongoose');
const product = mongoose.Schema({
    categories:[{type:mongoose.Schema.Types.ObjectId,ref:"category"}],
    description:{type:String,required:false},
    images:[{type:String}],
    largequantityprice:[{quantity:Number,price:Number}],
    moq:{type:Number,required:false},
    name:{type:String,required:true},
    price:{type:Number,required:true},
})
module.exports = mongoose.model('product',product);
