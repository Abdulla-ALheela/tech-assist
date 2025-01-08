const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({

  requesId: { type: String },

  request: { type: String, required: true, },

});

const userSchema = new mongoose.Schema({

  username: { type: String, required: true, },

  password: { type: String, required: true, },

  isadmin: {type: Boolean},

  requests: [requestSchema],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
