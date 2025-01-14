require("dotenv").config();
require("./config/database");
const express = require("express");
const app = express();

const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require('express-session');
const MongoStore = require("connect-mongo");
const isSignedIn = require("./middleware/is-signed-in.js");
const passUserToView = require("./middleware/pass-user-to-view.js");
const isAdmin = require("./middleware/is-admin.js");
const User = require("./models/user");
const path = require('path');

//controlles

const authController = require("./controllers/auth.js");
const requestsController = require('./controllers/requests.js');
const adminsController = require('./controllers/admins.js');

// Set the port from environment variable or default to 3000

const port = process.env.PORT ? process.env.PORT : "3000";

//Middleware

// Middleware to parse URL-encoded data from forms
app.use(express.urlencoded({ extended: false }));

// Middleware for using HTTP verbs such as PUT or DELETE
app.use(methodOverride("_method"));

// Morgan for logging HTTP requests
app.use(morgan('dev'));

//CSS Middleware
app.use(express.static(path.join(__dirname, 'public')));

//creating the session and save in the database
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);

//Middleware to pass the information in the session to global variable that is passed to all views
app.use(passUserToView);


//Public routs

//route to direct the user to the landing page if the user is not sing in and if the user is admin, it will direct it to the admin page
app.get('/', async (req, res) => {
  if (req.session.user) {

    const checkIsAdmin = await User.findById(req.session.user._id)
    if (checkIsAdmin.isAdmin) {
      res.redirect(`/users/${req.session.user._id}/admins`);
    } else {
      res.redirect(`/users/${req.session.user._id}/requests`);
    }

  } else {

    res.render('index.ejs');

  }

});

// the controller that handle the sign-up, sign-In and sign-out process
app.use("/auth", authController);


//Protected routs

// check if user signed in 
app.use(isSignedIn)

//users controller that allow the user to create, edit and delete requests
app.use("/users/:userId/requests", requestsController);

//check if user is an admin
app.use(isAdmin)

//admins controller that handle all admin operations
app.use("/users/:userId/admins", adminsController);


app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
