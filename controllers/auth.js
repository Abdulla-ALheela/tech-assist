const express = require("express");
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const router = express.Router();


// router to render sign-up page
router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs");
});

//router to check the information coming from the sign-up form and to crate new users
router.post("/sign-up", async (req, res) => {

  //check if the password and confirm password matches
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  if (password !== confirmPassword) {
    return res.send("Password do not match");
  }

  //check if the user in the database
  const checkUserInDatabase = await User.findOne({ username: req.body.username });
  if (checkUserInDatabase) {
    return res.send("Username already taken.");
  }

  //hashes the password before save it in the database
  const hashedPassword = bcrypt.hashSync(password, 10)
  req.body.password = hashedPassword;

  //create the user
  const user = await User.create(req.body);


  //sign in the user directly after the sign-up process done
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

//router to render sign-in form page
router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs");
});

//router to check the information coming from the sign-in form and sign-in the user
router.post("/sign-in", async (req, res) => {

  //check if the user in the database
  const userInDatabase = await User.findOne({ username: req.body.username });
  if (!userInDatabase) {
    return res.send("Login failed. Please try again.");
  }

  //unhashing the password and check if the database password matches the password from the form 
  const validPassword = bcrypt.compareSync(
    req.body.password,
    userInDatabase.password
  );

  //if not correct password display message
  if (!validPassword) {
    return res.send("Login failed. Please try again.");
  }

  //if all information matches sign-in the user
  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id,
  };

  req.session.save(() => {
    res.redirect("/");
  });
});

//router to sign-out the user
router.get("/sign-out", (req, res) => {

  req.session.destroy(() => {
    res.redirect("/");
  });
});


module.exports = router;
