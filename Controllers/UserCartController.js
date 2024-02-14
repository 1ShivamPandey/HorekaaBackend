const asynchandler = require("express-async-handler");
const productuploadDetails = require("../model/ProductDashboardModel");
const CartData = asynchandler (async(req,res)=>{
try {
    const {  _id, menuId,menuName,menuDetail } = req.body;
    console.log("Requesting data...................", req.body); // Log the received data
    
    const RestaurantData = await productuploadDetails.findOne({ _id });
    console.log("Restaurant Found:...........", RestaurantData);
    
    if (!RestaurantData) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    if (!RestaurantData.menu || !Array.isArray(RestaurantData.menu)) {
      RestaurantData.menu = [];
      }
      
    RestaurantData.menu.push({menuId,menuName,menuDetail});
    await RestaurantData.save();
    
    console.log("Menu added bro .................", RestaurantData);

    res.status(201).json({ message: 'Menu added to restaurant successfully' });
    console.log("added to menu")
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
    console.log(" unable to add menu")
  }
})

// const GetCartData = asynchandler(async (req, res) => {
//     const { number } = req.body;
  
//     try {
//       const user = await UserDetails.findOne({ number });
  
//       if (!user) {
//         return res.status(404).json({ message: 'User not found' });
//       }
//       const cartData = user.cart || [];
//       res.status(200).json({ cart: cartData });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Internal Server Error' });
//     }
//   });
  
module.exports = {CartData,};