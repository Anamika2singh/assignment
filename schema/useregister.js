const mongoose= require('mongoose');
const Schema = mongoose.Schema;

const registerschema = new Schema({
    name:{type:String,required:true},
    age:{type:Number,required:true},
    location:{type:String,required:true},
    email_id:{type:String,required:true},
    phone_number:{type:Number,required:true},
    password:{type:String,required:true},
    status:{type:Number,default:0},
    created_at:{type: Date,default: Date.now,},
    updated_at:{type:String, default:''}
})
module.exports=mongoose.model('register',registerschema);