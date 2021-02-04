const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const data= new Schema({
    gameId:{type:mongoose.Types.ObjectId},
    u1id:{type:mongoose.Types.ObjectId},
   u2id:{type:mongoose.Types.ObjectId},
   scoreu1:{type:Number,required:true},
    scoreu2:{type:Number,required:true},
    win:{type:Boolean},//true u1 wins else u2
    status : {type:Number,default : 0},
    created_at:{type:Date, default:Date.now},
    updated_at:{type:String, default:''}
})
module.exports = mongoose.model('Result',data);