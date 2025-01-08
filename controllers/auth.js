const express = require("express");
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const router = express.Router();



router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");
});

router.post("/sign-up", async (req, res) => {
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if (password !== confirmPassword) {
        return res.send("Password do not match");
    }

    const checkUserInDatabase = await User.findOne({ username: req.body.username });
    if (checkUserInDatabase) {
        return res.send("Username already taken.");
    }

    const hashedPassword = bcrypt.hashSync(password, 10)
    req.body.password = hashedPassword;

    const user = await User.create(req.body);
 
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
      return res.send("Login failed. Please try again.");
    }

      req.session.user = {
        username: userInDatabase.username,
        _id: userInDatabase._id,
      };
      
      req.session.save(() => {
        res.redirect("/");
      });
    
});

router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in.ejs");
  });

  router.post("/sign-in", async (req, res) => {
  
    const userInDatabase = await User.findOne({ username: req.body.username });
    if (!userInDatabase) {
      return res.send("Login failed. Please try again.");
    }

    const validPassword = bcrypt.compareSync(
        req.body.password,
        userInDatabase.password
      );
      
      if (!validPassword) {
        return res.send("Login failed. Please try again.");
      }

      req.session.user = {
        username: userInDatabase.username,
        _id: userInDatabase._id,
      };
      
      req.session.save(() => {
        res.redirect("/");
      });
  });
  
  router.get("/sign-out", (req, res) => {

    req.session.destroy(() => {
      res.redirect("/");
    });
  });
 

module.exports = router;
