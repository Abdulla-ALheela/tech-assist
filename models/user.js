const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({

  requestId: { type: Number },

  request: { type: String, required: true, },

  admin: {type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
   }

});

const userSchema = new mongoose.Schema({

  username: { type: String, required: true, },

  password: { type: String, required: true, },

  isadmin: {type: Boolean},

  requests: [requestSchema],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
