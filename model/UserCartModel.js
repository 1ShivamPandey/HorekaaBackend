const mongoose = require("mongoose");
const cartItemSchema = mongoose.Schema({
  productId: { type: String },
  name: { type: String },
  price: { type: String },
  Cartimage: { type: String },
});

const userCartSchema = mongoose.Schema({
  userId:{type:mongoose.Schema.Types.ObjectId,ref:"UserprofileDetails"},
  userName:{type:String},
  cartItems: [cartItemSchema],
})

const UserCart = mongoose.model("UserCart", userCartSchema);
module.exports = UserCart;
