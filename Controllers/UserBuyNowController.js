const asynchandler = require("express-async-handler");
const UserDetails = require("../model/UserProfileModel");

const BuyNowData = asynchandler(async (req, res) => {
  try {
    const {number, pincode, address,items } = req.body;
    console.log("Requesting data...................", req.body); // Log the received data

    const user = await UserDetails.findOne({ number });
    console.log("User Found:...........", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    //const cartItem = {number, productId, name, price };
    if (!user.buynow || !Array.isArray(user.buynow)) {
      user.buynow = [];
    }

    // user.buynow.push({
    //   productId,
    //   name,
    //   price,
    //   size,
    //   quantity,
    //   pincode,
    //   address,
    // });

    items.forEach((item) => {
      user.buynow.push({
        productId: item.productId,
        name: item.name,
        price: item.price,
        size: item.size,
        quantity: item.quantity,
        pincode,
        address,
      });
    });

    await user.save();

    console.log("User after adding to buy now.................", user); // Log user to check cart

    res.status(201).json({ message: "Item added to buynow  successfully" });
    console.log("added to Buynow");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
    console.log(" unable to add to buynow");
  }
});

const GetBuyNowData = asynchandler(async (req, res) => {
  const { number } = req.body;

  try {
    const user = await UserDetails.findOne({ number });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const buyData = user.buynow || [];

    res.status(200).json({ buynow: buyData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = { BuyNowData, GetBuyNowData };
