const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const { default: mongoose } = require('mongoose');



router.get('/', async (req, res) => {
    try {

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



  router.get("/:userId/:requestId/edit", async (req, res) => {
    try {
    
      const currentUser = await User.findById(req.params.userId)

      const request = currentUser.requests.id(req.params.requestId);

      const admin = await User.findById(request.admin)
      
      res.render('admins/edit-request.ejs', {
        request: request,
        admin:admin,
        currentUser:currentUser,
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

  router.put("/:userId/:requestId", async (req, res) => {
    try {
   
      const currentUser = await User.findById(req.params.userId);

      const request = currentUser.requests.id(req.params.requestId);
    
      request.set(req.body);
    
      await currentUser.save();

      res.redirect(
        `/users/${currentUser._id}/admins/${currentUser._id}/${req.params.requestId}/edit`
      );

    } catch (error) {

      console.log(error);
      res.redirect('/');

    }
  });


module.exports = router;