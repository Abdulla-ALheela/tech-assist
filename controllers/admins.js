const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const { default: mongoose } = require('mongoose');



//landing page for admins that display all the requests assigned to them
router.get('/', async (req, res) => {
  try {

    //get user information
    const currentUser = await User.findById(req.session.user._id);

    //get all the requests that has the admin ID
    const users = await User.aggregate([
      { $unwind: "$requests" },
      { $match: { "requests.admin": new mongoose.Types.ObjectId(req.session.user._id) } },
    ]);


    res.render('admins/index.ejs', {
      currentUser: currentUser,
      users: users,
    });
  } catch (error) {

    res.redirect('/');

  }
});


//render a page with all users
router.get('/master', async (req, res) => {
  try {

    //get the admin information, all users and send them to the master view
    const currentUser = await User.findById(req.session.user._id);
    const allUsers = await User.find();
    res.render('admins/master.ejs', {
      currentUser: currentUser,
      allUsers: allUsers,
    });

  } catch (error) {

    res.redirect('/');

  }
});


//render the form to make a user admin
router.get('/:userId/edit-user', async (req, res) => {
  try {

    //get admin information and the user infomation 
    const currentUser = await User.findById(req.session.user._id);
    const user = await User.findById(req.params.userId);


    res.render('admins/edit-user.ejs', {
      user: user,
      currentUser: currentUser,
    });
  } catch (error) {


    res.redirect('/');

  }
});


//render edit-request view to edit the request status
router.get("/:userId/:requestId/edit", async (req, res) => {
  try {

    //get the user who created the request and then get the request information with the assigned admin information
    const currentUser = await User.findById(req.params.userId)
    const request = currentUser.requests.id(req.params.requestId);
    const admin = await User.findById(request.admin)

    //all users
    const users = await User.find();

    res.render('admins/edit-request.ejs', {
      request: request,
      admin: admin,
      currentUser: currentUser,
      users: users,
    });
  } catch (error) {

    res.redirect('/');

  }
});


//router to recive the form information from edit-user viwe and update the database
router.put("/:userId", async (req, res) => {
  try {
    //assignee true or false based on if the box is checked or no
    if (req.body.isAdmin === "on") {
      req.body.isAdmin = true;
    } else {
      req.body.isAdmin = false;
    }

    //update the database
    await User.findByIdAndUpdate(req.params.userId, req.body);

    res.redirect(`/users/:userId/admins/master`);

  } catch (error) {


    res.redirect('/');

  }
});


//router to recive the form information from edit-request viwe and update the database
router.put("/:userId/:requestId", async (req, res) => {
  try {

    //get the user to get the request information and then updated the request in the database and then save it 
    const currentUser = await User.findById(req.params.userId);
    const request = currentUser.requests.id(req.params.requestId);
    request.set(req.body);
    await currentUser.save();

    //redirect to the admin landing page
    res.redirect(
      `/users/${currentUser._id}/admins`
    );

  } catch (error) {


    res.redirect('/');

  }
});


module.exports = router;