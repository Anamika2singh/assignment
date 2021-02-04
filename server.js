// require('dotenv').config()
let port=process.env.PORT ||3000
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
// const router = express.Router();


app.use(bodyparser.json({extended:true}));
app.use(bodyparser.urlencoded({extended:true}))

//database coonection with mongodb
mongoose.Promise=global.Promise;
mongoose.connect('mongodb+srv://annu:anamika@cluster0.fhigx.mongodb.net/game?retryWrites=true&w=majority',{useNewUrlParser:true ,useUnifiedTopology: true})
.then(()=>console.log('connection successful'))
.catch((err)=>console.error(err))

const playerouter = require('./route/player');
const adminrouter = require('./route/admin');

app.use('/player',playerouter);
app.use('/admin',adminrouter);

app.listen(port,()=>{
    console.log("server listening on 3000");
})