const asynchandler = require("express-async-handler");
const UserDetails = require("../model/UserProfileModel");
const directorders = require("../model/DirectOrdersModel");
const DirectOrdersData = asynchandler(async (req, res) => {
  try {
    const { productId, number, name, price, size, quantity, pincode, address } =
      req.body;
    console.log("Requesting data...................", req.body); // Log the received data

    const user = await UserDetails.findOne({ number });
    console.log("User Found:...........", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    //const cartItem = {number, productId, name, price };
    if (!user.directOrders || !Array.isArray(user.directOrders)) {
      user.directOrders = [];
    }

    user.directOrders.push({
      productId,
      name,
      price,
      size,
      quantity,
      pincode,
      address,
    });

    await user.save();

    const DirectOrders = new directorders({
      name: user.name,
      number: user.number,
      Shippingstatus:'none',
      items: [{productId, name, price, size, quantity, pincode, address}],
    });

    await DirectOrders.save();

    console.log("User after adding to  direct buy now.................", user); // Log user to check cart
    res
      .status(201)
      .json({ message: "Item added to direct order  successfully" });
    console.log("added to direct orders");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
    console.log(" unable to add to direct order");
  }
});

const GetDirectOrdersData = asynchandler(async (req, res) => {
  const { number } = req.body;

  try {
    const user = await UserDetails.findOne({ number });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const OrderData = user.directOrders || [];

    res.status(200).json({ directOrders: OrderData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = { DirectOrdersData, GetDirectOrdersData };
