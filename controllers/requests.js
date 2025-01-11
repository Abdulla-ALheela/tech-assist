
const express = require('express');
const router = express.Router();

const User = require('../models/user.js');
const Counter = require('../models/counter.js');


router.get('/', async (req, res) => {
  try {
  
    const currentUser = await User.findById(req.session.user._id);

    res.render('requests/index.ejs', {
      requests: currentUser.requests,
    });
  } catch (error) {

    console.log(error);
    res.redirect('/');
  }
});


  router.get('/new', async (req, res) => {
try{
    const users = await User.find();

    res.render('requests/new.ejs',{
      users: users,
    });
  } catch(error){

    res.redirect('/');

  }
  });

  router.post('/', async (req, res) => {
    try {

    const currentUser = await User.findById(req.session.user._id);

    const requestsId = await Counter.aggregate([
      {$sort: {_id:-1}},
    ]);
    
   let updatedReuestId = parseFloat(requestsId[0].counter) + parseFloat("1")

    updatedReuestId = updatedReuestId.toString().padStart(5, "0");

  await Counter.create({counter: updatedReuestId})

   req.body.requestId = updatedReuestId

      currentUser.requests.push(req.body);
      await currentUser.save();
      res.redirect(`/users/${currentUser._id}/requests`);

    } catch (error) {

      console.log(error);
      res.redirect('/');

    }
  });

  router.get('/:requestId', async (req, res) => {
    try {
    
      const currentUser = await User.findById(req.session.user._id)

      const request = currentUser.requests.id(req.params.requestId);

      const admin = await User.findById(request.admin)

      res.render('requests/show.ejs', {
        request: request,
        admin:admin,
      });
    } catch (error) {
   
      console.log(error);
      res.redirect('/');
    }
  });

  router.delete('/:requestId', async (req, res) => {
    try {
   
      const currentUser = await User.findById(req.session.user._id);

      currentUser.requests.id(req.params.requestId).deleteOne();

      await currentUser.save();

      res.redirect(`/users/${currentUser._id}/requests`);
    } catch (error) {
  
      console.log(error);
      res.redirect('/');
    }
  });

  router.get('/:requestId/edit', async (req, res) => {
    try {

      const users = await User.find();

      const currentUser = await User.findById(req.session.user._id);

      const request = currentUser.requests.id(req.params.requestId);

      const admin = await User.findById(request.admin)

      res.render('requests/edit.ejs', {
        users: users,
        request: request,
        admin:admin,
      });

    } catch (error) {

      console.log(error);
      res.redirect('/');

    }
  });

  router.put('/:requestId', async (req, res) => {
    try {
   
      const currentUser = await User.findById(req.session.user._id);

      const request = currentUser.requests.id(req.params.requestId);
    
      request.set(req.body);
    
      await currentUser.save();

      res.redirect(
        `/users/${currentUser._id}/requests/${req.params.requestId}`
      );

    } catch (error) {

      console.log(error);
      res.redirect('/');

    }
  });



module.exports = router;