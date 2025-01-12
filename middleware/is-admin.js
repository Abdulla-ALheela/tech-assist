const User = require("../models/user");
const isAdmin = async (req, res, next) => {
   const checkIsAdmin = await User.findById(req.session.user._id)
   if (checkIsAdmin.isAdmin) return next();
   res.redirect("/auth/sign-in");
 
  };
  
  module.exports = isAdmin;
  