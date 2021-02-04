const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const addgame = new Schema({
    gameName :{type:String},
    status : {type:Number,default : 0},
    created_at:{type:Date, default:Date.now},
    updated_at:{type:String, default:''}
})
module.exports= mongoose.model('creategame',addgame);