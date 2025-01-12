const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({

  requestId: { type: String },

  requestDescription: { type: String, required: true, },

  admin: {type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
   }

});

const userSchema = new mongoose.Schema({

  username: { type: String, required: true, },

  password: { type: String, required: true, },

  isAdmin: {type: Boolean},

  requests: [requestSchema],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
