const mongoose = require("mongoose");
const favourite = require("./user");

const homeScema = mongoose.Schema({
  houseName: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  rating: { type: Number, required: true },
  photo: String,
  description: String,
});
//home from favourite list will be deleted with home deleted by host

homeScema.pre("findOneAndDelete", async function (next) {
  console.log("Came to prevoke");
  const homeId = this.getQuery()._id;
  await favourite.deleteMany({ houseId: homeId });
  next();
});

//creates model Home having scema like homeScema
module.exports = mongoose.model("Home", homeScema);
//now model Home is exported from here
