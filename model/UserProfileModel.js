const mongoose = require("mongoose");
const cart = require("./UserCartModel");
const buynow = require("./UserBuyNowModel")
const directOrders = require("./DirectOrdersModel")
const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    number: { type: String, required: true },
    password: { type: String, required: true },
    otp: { type: String, required:true },
    otpExpiration: {
      type: Date,
      required: true,
      default: Date.now() + 2 * 60 * 1000 
    },
    isVerified:{type:Boolean},
    directOrders:[{ productId: String, name: String, price: String,size:String,quantity:String,pincode:String,address:String}],
    cart:[{ productId: String, name: String, price: String,Cartimage:String }],
    buynow:[{ productId: String, name: String, price: String,size:String,quantity:String,pincode:String,address:String}],
    // cart:[cart.schema] this is not working
  },
  { timestamps: true } // this adds created and update time timestamps is mongoose reserved keyword
);

userSchema.methods = async function (enteredPassword) {
  return await compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified) {
    // this.isModified("password")
    next();
    console.log("save");
  }
  console.log("save pta nahi");

  this.password = this.password;
  console.log(this.password);
});

//====================================================  CART  ===========================================================

const UserDetails = mongoose.model("UserprofileDetails", userSchema);
module.exports = UserDetails;
