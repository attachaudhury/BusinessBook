const mongoose = require('mongoose');
const product = mongoose.Schema({
    barcode:{type:String},
    categories:[{type:String}],
    carrycost:{type:Number,default:0},
    discount:{type:Number,default:0},
    description:{type:String},
    images:[{type:String}],
    name:{type:String,required:true},
    purchaseprice:{type:Number,default:0},
    purchaseactive:{type:Boolean,default:true},
    quantity:{type:Number,default:0},
    saleprice:{type:Number,default:0},
    saleactive:{type:Boolean,default:true},
    subproduct:[{type:String}],
    type:{type:String,default:"product"}
})
module.exports = mongoose.model('product',product,'product');
