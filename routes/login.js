const express = require("express");
const router = express.Router();
const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

// login authentication

router.post("/login", (req, res) => {
  const username = req.body.email;
  console.log(req.body);
  const password = req.body.password;

  User.findOne({ email: username }, (err, obj) => {
    if (err) {
      console.log(err.message);
    } else {
      bcrypt.compare(password, obj.password, (err, result) => {
        if (err) {
          console.log(err.message);
        }
        if (result) {
          const token = jwt.sign({ obj }, "secretjwtkey", {
            expiresIn: "10m",
          });
          const refreshToken = jwt.sign({ obj }, "refreshtokenkey", {
            expiresIn: "7d",
          });
          res.json({
            auth: true,
            token: token,
            refreshToken: refreshToken,
            result: obj,
          });
        } else {
          res.send("failed");
        }
      });
    }
  });
});

module.exports = router;
