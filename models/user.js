const mongoose = require("mongoose");

const userScema = mongoose.Schema({
  firstName: { type: String, required: [true, "First name is required"] },
  lastName: { type: String },
  email: { type: String, required: [true, "Email is required"], unique: true },
  password: { type: String, required: [true, "Password is required"] },
  userType: { type: String, enum: ["guest", "host"], default: "guest" },
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Home" }],
  booking: [{ type: mongoose.Schema.Types.ObjectId, ref: "Home" }],
});

//creates model Home having scema like homeScema
module.exports = mongoose.model("User", userScema);
//now model Home is exported from here
