const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { Validator } = require("node-input-validator");
const jwt = require("jsonwebtoken");
const verfiyToken = require("../middleware/authenticate");
const useregister = require("../schema/useregister");
const gameCreate = require("../schema/game");
const resulTable = require("../schema/result");
const { findOne } = require("../schema/useregister");

router.post("/register", async (req, res, next) => {
  //  console.log(req.body);
  try {
    const v = new Validator(req.body, {
      name: "required",
      age: "required|integer",
      location: "required",
      email_id: "required|email",
      phone_number: "required|integer",
      password: "required",
    });
    const matched = await v.check();
    let name = v.errors.name ? v.errors.name.message : ",";
    let age = v.errors.age ? v.errors.age.message : ",";
    let location = v.errors.location ? v.errors.location.message : ",";
    let email_id = v.errors.email_id ? v.errors.email_id.message : ",";
    let phone_number = v.errors.phone_number
      ? v.errors.phone_number.message
      : ",";
    let password = v.errors.password ? v.errors.password.message : ",";
    if (!matched) {
      res.status(422).json({
        statusCode: 422,
        message: name + age + location + email_id + phone_number + password,
      });
    } else {
      let checkDuplicate = await useregister.findOne({
        phone_number: req.body.phone_number,
      });
      if (checkDuplicate) {
        res.status(400).json({
          statusCode: 400,
          message: "you are already register with this phone_number",
        });
      } else {
        useregister
          .create({
            name: req.body.name,
            age: req.body.age,
            location: req.body.location,
            email_id: req.body.email_id,
            phone_number: req.body.phone_number,
            password: bcrypt.hashSync(req.body.password, saltRounds),
          })
          .then((user) => {
            res.status(200).json({
              statusCode: 200,
              message: "Signup Sucessfully",
              user_details: user,
            });
          })
          .catch((err) =>
            res.status(500).json({
              statusCode: 500,
              message: "Internal Server error",
              error: err.message,
            })
          );
      }
    }
  } catch (err) {
    res.status(400).json({
      statusCode: 400,
      message: "something went wrong",
      error: err.message,
    });
  }
});
router.post("/login", async (req, res, next) => {
  // console.log(req.body);
  try {
    let found = await useregister.findOne({
      phone_number: req.body.phone_number,
    });
    // console.log(found.password);
    if (found == null) {
      res
        .status(400)
        .json({ statusCode: 400, message: "this phone_number not registered" });
    } else {
      bcrypt.compare(req.body.password, found.password, (err, user) => {
        if (user == true) {
          let token = jwt.sign(found.toJSON(), "LOG_KEY");
          console.log(token);
          let check = found.toJSON();
          check.token = token;
          res.status(200).json({
            statusCode: 200,
            message: "login successfully",
            user_details: check,
          });
        } else {
          console.log(" password  not matched");
          res
            .status(400)
            .json({ statusCode: 400, message: "password not matched" });
        }
      });
    }
  } catch (err) {
    res.status(400).json({
      statusCode: 400,
      message: "something went wrong",
      error: err.message,
    });
  }
});
router.post("/editProfile", verfiyToken, async (req, res, next) => {
  let user = req.userData;
  console.log(user._id);
  let get = await useregister.findOne({ _id: user._id });
  if (get) {
    var arr = {};
    const its = ["name", "age", "location", "email_id", "password"];
    for (const iterator of its) {
      // console.log(iterator);
      // console.log(req.body[iterator])
      if (req.body[iterator]) {
        arr[iterator] = req.body[iterator];
      }
    }
    console.log(arr);
    let update = await useregister.findByIdAndUpdate(
      { _id: user._id },
      { $set: arr }
    );
    console.log(update);
    let updatedData = await useregister.findOne({ _id: user._id });
    console.log(updatedData);
    res.status(200).json({
      statusCode: 200,
      message: "updated successfully",
      "updated_data ": updatedData,
    });
  } else {
    res.status(404).json({ statusCode: 404, message: "user not found" });
  }
});
router.get("/getgames", (req, res, next) => {
  console.log("result");
  gameCreate
    .find({}, { gameName: 1 })
    .then((games) => {
      res.status(200).json({
        statusCode: 200,
        message: "list of games",
        result: games,
      });
    })
    .catch((err) => {
      res.status(500).json({
        statuscode: 500,
        message: "internal server error",
        error: err.message,
      });
    });
});

router.get("/getresult", (req, res, next) => {
  console.log("result");
  resulTable
    .find({}, { gameId: 1, u1id: 1, u2id: 1, scoreu1: 1, scoreu2: 1, win: 1 })
    .then((gamesres) => {
      res.status(200).json({
        statusCode: 200,
        message: "result of games here",
        result: gamesres,
      });
    })
    .catch((err) => {
      res.status(500).json({
        statuscode: 500,
        message: "internal server error",
        error: err.message,
      });
    });
});
module.exports = router;
