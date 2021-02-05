const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Validator } = require("node-input-validator");
const { find, count } = require("../schema/game");


const gameCreate = require("../schema/game");
const resulTable = require("../schema/result");
console.log("admin");
router.post("/creategame", async (req, res, next) => {
  // console.log(req.body);
  try {
    const v = new Validator(req.body, {
      gameName: "required",
    });
    const matched = await v.check();
    let gameName = v.errors.gameName ? v.errors.gameName.message : "";
    if (!matched) {
      res.status(422).json({ statusCode: 422, message: gameName });
    } else {
      let checkDuplicate = await gameCreate.findOne({
        gameName: req.body.gameName,
      });
      if (checkDuplicate) {
        res.status(400).json({
          statusCode: 400,
          message: "already added this game",
        });
        return;
      }

      let found = await gameCreate.find();
      if (found.length >= 3) {
        res.status(400).json({ statusCode: 400, message: "three games added" });
        return;
      }

      gameCreate
        .create({
          gameName: req.body.gameName,
        })
        .then((result) => {
          res.status(200).json({
            statusCode: 200,
            message: "added sucessfully",
            details: result,
          });
        })
        .catch((err) => {
          res.status(500).json({
            statusCode: 500,
            message: "interval sever error",
            error: err.message,
          });
        });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      statusCode: 400,
      message: "something went wrong",
      error: err.message,
    });
  }
});

router.post("/postResult", async (req, res, next) => {
  try {
    const v = new Validator(req.body, {
      gameId: "required",
      u1id: "required",
      u2id: "required",
      scoreu1: "required|integer",
      scoreu2: "required|integer",
      // win:'requried',
    });
    const matched = await v.check();
    let gameId = v.errors.gameId ? v.errors.gameId.message : ",";
    let u1id = v.errors.u1id ? v.errors.u1id.message : ",";
    let u2id = v.errors.u2id ? v.errors.u2id.message : ",";
    let scoreu1 = v.errors.scoreu1 ? v.errors.scoreu1.message : ",";
    let scoreu2 = v.errors.scoreu2 ? v.errors.scoreu2.message : ",";
    //   let win=v.win.password?v.errors.win.message:','
    if (!matched) {
      res.status(422).json({
        statusCode: 422,
        message: gameId + u1id + u2id + scoreu1 + scoreu2,
      });
    } else {
      let resultdata = await resulTable.create({
        gameId: req.body.gameId,
        u1id: req.body.u1id,
        u2id: req.body.u2id,
        scoreu1: req.body.scoreu1,
        scoreu2: req.body.scoreu2,
        win: req.body.win,
      });
      if (resultdata) {
        res.status(200).json({
          statusCode: 200,
          message: "result added",
          details: resultdata,
        });
      } else {
        res
          .status(500)
          .json({ statusCode: 500, message: "internal server error" });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      statusCode: 400,
      message: "something went wrong",
      errors: err.message,
    });
  }
});

router.post("/leaderboard", async (req, res, next) => {
  try {
    let games = await resulTable.distinct("gameId");
    console.log(games);
    let leader = [];
    let winner =[];
 for (game of games) 
 {
      let details = await resulTable.aggregate([
        { $match: { gameId: game } },
          {
          $group: {
            _id: { u1id: "$u1id", u2id: "$u2id" },
            u1_totalpoints: { $sum: "$scoreu1" },
            u2_totalpoints: { $sum: "$scoreu2" },
              },
          },
      ]);
      console.log(details);
         details.forEach(
                async(element) => {
                  // console.log(element)
              // console.log(element._id.u1id);
              // console.log(element._id.u2id);
              // console.log(element.u1_totalpoints);
              // console.log(element.u2_totalpoints);
          // let single = await resulTable.find({'u1id':element._id.u1id})
            // console.log (Boolean(single.win))
            // console.log(single)
              leader.push({
                "gameid":game,
                "u1id" : element._id.u1id,
                "u1totalpoints ":element.u1_totalpoints,
                "u2id": element._id.u2id,
                "u2totalpoints":element.u2_totalpoints
              })
            // console.log(leader);



            // winner.push(element._id.u1id,element._id.u2id)
            // console.log(winner);
        
          //        console.log(single);
               // let single1 = await resulTable.find({'u1id':element._id.u1id})
          //   console.log (Boolean(single1.win))
          //        console.log (Boolean(single.win));
          //        if(Boolean(single.win)){
          //         console.log("validatn");
          //        }
                
      });
      
    }
    // console.log(winner);
    
   console.log(leader);
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

module.exports = router;
