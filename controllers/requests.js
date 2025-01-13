
const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Counter = require('../models/counter.js');

// landing page that contain all the created requests for the user and a link to make new requests
router.get('/', async (req, res) => {
  try {
    //getting the user information
    const currentUser = await User.findById(req.session.user._id);

    //send all the user requests to the index page
    res.render('requests/index.ejs', {
      requests: currentUser.requests,
    });

  } catch (error) {

    res.redirect('/');

  }
});

// router to get the form to make new request
router.get('/new', async (req, res) => {
  try {

    //get all the users and send them to the page to filters the admins for the drop down menu
    const users = await User.find();

    res.render('requests/new.ejs', {
      users: users,

    });
  } catch (error) {

    res.redirect('/');

  }
});

// router to handle creating new requests in the database
router.post('/', async (req, res) => {
  try {

    //get the sign-in user information
    const currentUser = await User.findById(req.session.user._id);

    //rearrange all the requests IDs in the database to make sure the biggest ID if first ID
    const requestsId = await Counter.aggregate([
      { $sort: { _id: -1 } },
    ]);

    //increment the biggest ID by 1
    let updatedReuestId = parseFloat(requestsId[0].counter) + parseFloat("1")


    //add the 0 in front of the number and make it string 
    updatedReuestId = updatedReuestId.toString().padStart(5, "0");

    //add the new ID to the database
    await Counter.create({ counter: updatedReuestId })

   //attach the ID to the request
    req.body.requestId = updatedReuestId

    //add the request to the user object, save it in the database and redirect the user the landing page
    currentUser.requests.push(req.body);
    await currentUser.save();
    res.redirect(`/users/${currentUser._id}/requests`);

  } catch (error) {

    
    res.redirect('/');

  }
});

//router for the show page to show the request details
router.get('/:requestId', async (req, res) => {
  try {

    //get the signed-in user information
    const currentUser = await User.findById(req.session.user._id)

    //get the request information
    const request = currentUser.requests.id(req.params.requestId);

    //get the admin information from the refrenced ID
    const admin = await User.findById(request.admin)

    res.render('requests/show.ejs', {
      request: request,
      admin: admin,
    });
  } catch (error) {

    
    res.redirect('/');
  }
});

//router to deletes requests
router.delete('/:requestId', async (req, res) => {
  try {

    //get the user and then find the request by the ID then delete it and save
    const currentUser = await User.findById(req.session.user._id);
    currentUser.requests.id(req.params.requestId).deleteOne();
    await currentUser.save();

    //redirect to the landing page
    res.redirect(`/users/${currentUser._id}/requests`);
  } catch (error) {

   
    res.redirect('/');
  }
});


//router that display the edit form
router.get('/:requestId/edit', async (req, res) => {
  try {

    //get all the users
    const users = await User.find();

    //get the signed-in user information
    const currentUser = await User.findById(req.session.user._id);

    //get the request information
    const request = currentUser.requests.id(req.params.requestId);

    //get the admin information from the refrenced ID
    const admin = await User.findById(request.admin)

    res.render('requests/edit.ejs', {
      users: users,
      request: request,
      admin: admin,
    });

  } catch (error) {

    
    res.redirect('/');

  }
});

//router that processes the edit form information
router.put('/:requestId', async (req, res) => {
  try {

    //get the signed-in user information
    const currentUser = await User.findById(req.session.user._id);

    //get the request information
    const request = currentUser.requests.id(req.params.requestId);

    //update the inforamtion and save them
    request.set(req.body);
    await currentUser.save();

    //redirect to the show page for the updated request
    res.redirect(
      `/users/${currentUser._id}/requests/${req.params.requestId}`
    );

  } catch (error) {

    
    res.redirect('/');

  }
});



module.exports = router;