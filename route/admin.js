const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { Validator } = require('node-input-validator');
const { find } = require('../schema/game');
const gameCreate = require('../schema/game');
const resulTable = require('../schema/result');
console.log('admin')
router.post('/creategame',async(req,res,next)=>{
    // console.log(req.body);
    try{
        const v = new Validator(req.body,{
            gameName:'required'
        })
        const matched = await v.check();
        let gameName = v.errors.gameName?v.errors.gameName.message:''
        if(!matched){
    res.status(422).json({statusCode:422,message:gameName})
        }
        else{
            let checkDuplicate = await gameCreate.findOne({gameName:req.body.gameName})
            if(checkDuplicate){
              res.status(400).json({
                'statusCode':400 ,
                'message':'already added this game'})
                return;
            }

            let found = await gameCreate.find();
            if(found.length >= 3){
                res.status(400).json({statusCode:400,message:"three games added"})
                return;
            }
        
           gameCreate.create({
                    gameName : req.body.gameName
         }).then(result=>{ res.status(200).json({"statusCode":200,"message":"added sucessfully","details":result})})
       .catch(err=>{ res.status(500).json({"statusCode":500,"message":"interval sever error","error":err.message})})  
    
    }
}
    catch(err){ 
        console.log(err);
        res.status(400).json({
          'statusCode':400 ,
          "message":"something went wrong",
          "error":err.message})
        }
})

router.post('/postResult',async(req,res,next)=>{
  try{
  
    const v = new Validator(req.body,{
        gameId:'required',
        u1id:'required',
       u2id:'required',
       scoreu1:'required|integer',
        scoreu2:'required|integer'
        // win:'requried',
    })
    const matched= await v.check();
         let gameId=v.errors.gameId?v.errors.gameId.message:','
         let u1id=v.errors.u1id?v.errors.u1id.message:','
         let u2id=v.errors.u2id?v.errors.u2id.message:','
          let scoreu1=v.errors.scoreu1?v.errors.scoreu1.message:','
          let scoreu2=v.errors.scoreu2?v.errors.scoreu2.message:','
        //   let win=v.win.password?v.errors.win.message:','
     if(!matched){
         res.status(422).json({statusCode:422,message:gameId+u1id+u2id+scoreu1+scoreu2})
     }
  else{

    let resultdata = await resulTable.create({
        gameId:req.body.gameId,
        u1id:req.body.u1id,
       u2id:req.body.u2id,
       scoreu1:req.body.scoreu1,
        scoreu2:req.body.scoreu2,
        win:req.body.win,
      })
      if(resultdata){
          res.status(200).json({"statusCode":200,"message":"result added",details:resultdata})
      }
      else{
          res.status(500).json({"statusCode":500,"message":"internal server error"})
      }
  }
  }
 catch(err){
     console.log(err);
  res.status(400).json({"statusCode":400,"message":"something went wrong","errors":err.message})
 }
})

router.post('/leaderboard',async(req,res,next)=>{
    try{

       let games = await  resulTable.distinct("gameId");
       console.log(games);   
        for(game of games){
            let count1 =0,count2=0;
     let details = await resulTable.aggregate([
                //  {$match:{'gameId':game}},
                //  {$group:{_id:"$u1id",total:{$sum:"$scoreu1"}}}
                //  {$group:{_id:"$u2id",total:{$sum:"$scoreu2"}}}
                {
                    $project:
                      {
                        item:"$game",
                        totalwins:
                          {
                            $cond: { if: { $eq: [ "$win", true] }, then: count1++, else: count2++}
                          }
                      }
                 }
       
        ])
        console.log(details)
        // console.log("change");
}
    }
   catch(err){
       console.log(err);
       res.send(err);
   }
})

module.exports= router;