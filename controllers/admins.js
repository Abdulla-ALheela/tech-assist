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

module.exports = router;