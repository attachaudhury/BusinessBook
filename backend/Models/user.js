const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');
const user = mongoose.Schema({
    address:{type:String,required:false},
    department:{type:mongoose.Schema.Types.ObjectId,ref:"user",required:false,default:null},
    companyname:{type:String,required:false},
    companymessage:{type:String,required:false},
    companyimage:{type:String,required:false},
    createddate:{type:Date,required:false},
    city:{type:String,required:false},
    country:{type:String,required:false},
    designation:{type:String,required:false},
    dateofbirth:{type:Date,required:false},
    email:{type:String,required:false},
    firstname:{type:String,required:false},
    activestatus:{type:String,required:false,default:'active'},
    lastname:{type:String,required:false},
    lastlogindate:{type:Date,required:false},
    personalphone:{type:String,required:false},
    password:{type:String,required:true},
    profileimage:{type:String,required:false},
    role:{type:String,required:true},
    title:{type:String,required:false},
    username:{type:String,required:true,unique:true},
    workphone:{type:String,required:false},
    website:{type:String,required:false},
})

user.plugin(validator)
module.exports = mongoose.model('user',user,'user');
