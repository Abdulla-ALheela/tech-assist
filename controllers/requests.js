
const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

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
      currentUser.requests.push(req.body);
      await currentUser.save();
      res.redirect(`/users/${currentUser._id}/requests`);

    } catch (error) {

      console.log(error);
      res.redirect('/');

    }
  });


module.exports = router;