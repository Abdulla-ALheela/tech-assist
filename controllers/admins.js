const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Counter = require('../models/counter.js');

router.get('/', async (req, res) => {
    try {
      const currentUser = await User.findById(req.session.user._id);
      res.render('admins/index.ejs',{
        currentUser: currentUser,
      });
    } catch (error) {
  
      console.log(error);
      res.redirect('/');
    }
  });

  router.get('/master', async (req, res) => {
    try {
    const currentUser = await User.findById(req.session.user._id);
const allUsers = await User.find();
      res.render('admins/master.ejs',{
        currentUser: currentUser,
        allUsers: allUsers,
      });
    } catch (error) {
  
      console.log(error);
      res.redirect('/');
    }
  });

  router.get('/:userId/edit-user', async (req, res) => {
    try {

      const currentUser = await User.findById(req.session.user._id);
    const user = await User.findById(req.params.userId);


      res.render('admins/edit-user.ejs',{
        user: user,
        currentUser: currentUser,
      });
    } catch (error) {
  
      console.log(error);
      res.redirect('/');
    }
  });

  router.put("/:userId", async (req, res) => {
 

    if (req.body.isAdmin === "on") {
      req.body.isAdmin= true;
    } else {
      req.body.isAdmin = false;
    }
    
    await User.findByIdAndUpdate(req.params.userId, req.body);
  
    res.redirect(`/users/:userId/admins/master`);
  });

module.exports = router;