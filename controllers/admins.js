const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const { default: mongoose } = require('mongoose');



router.get('/', async (req, res) => {
    try {

let allRequests = [];
let i = 0;
      const currentUser = await User.findById(req.session.user._id);

      const users = await User.aggregate([
        { $unwind: "$requests" },
        { $match: { "requests.admin":new mongoose.Types.ObjectId(req.session.user._id) } },
      ]);


      res.render('admins/index.ejs',{
        currentUser: currentUser,
        users: users,
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


  router.get('/:userId/:requestId', async (req, res) => {
    try {
    
      const currentUser = await User.findById(req.params.userId)

      const request = currentUser.requests.id(req.params.requestId);

      const admin = await User.findById(request.admin)

      res.render('admins/show.ejs', {
        request: request,
        admin:admin,
      });
    } catch (error) {
   
      console.log(error);
      res.redirect('/');
    }
  });


module.exports = router;