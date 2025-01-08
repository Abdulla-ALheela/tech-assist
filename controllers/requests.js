
const express = require('express');
const router = express.Router();

const User = require('../models/user.js');

router.get('/', (req, res) => {
    res.send('Hello applications index route!');
  });

module.exports = router;