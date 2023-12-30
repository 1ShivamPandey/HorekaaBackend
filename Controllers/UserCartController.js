const asynchandler = require("express-async-handler");
const UserDetails = require("../model/UserProfileModel");

const CartData = asynchandler (async(req,res)=>{
try {
    const { number, productId, name, price ,Cartimage} = req.body;
    console.log("Requesting data...................", req.body); // Log the received data

    const user = await UserDetails.findOne({ number });
    console.log("User Found:...........", user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    //const cartItem = {number, productId, name, price };
    if (!user.cart || !Array.isArray(user.cart)) {
        user.cart = [];
      }
      
    user.cart.push({ productId, name, price ,Cartimage});
    await user.save();
    
    console.log("User after adding to cart.................", user); // Log user to check cart

    res.status(201).json({ message: 'Item added to cart successfully' });
    console.log("added to cart")
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
    console.log(" unable to add to cart")
  }
})

const GetCartData = asynchandler(async (req, res) => {
    const { number } = req.body;
  
    try {
      const user = await UserDetails.findOne({ number });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const cartData = user.cart || [];
      res.status(200).json({ cart: cartData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  
module.exports = {CartData,GetCartData,};