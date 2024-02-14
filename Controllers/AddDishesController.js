const asynchandler = require("express-async-handler");
const productuploadDetails = require("../model/ProductDashboardModel");

const AddDishData = asynchandler(async (req, res) => {
  try {
    const dishImage = req.file ? req.file.path : null; // Check if req.file is available
    console.log('File Data:', req.file);

    const { _id, dishName, dishDetail, dishPrice, dishSize, dishType, dishCategory, } = req.body;
    console.log("Requesting data...................", req.body);

    console.log("this id is ...........", _id);

    // Find the menu within the restaurant's menu array based on the provided _id
    const menuData = await productuploadDetails.findOne(
      { 'menu._id': _id },
      { 'menu.$': 1 }
    );

    if (!menuData || !menuData.menu || !Array.isArray(menuData.menu[0].addDish)) {
      return res.status(404).json({ message: 'Menu not found' });
    }

    // Check if addDish array exists, if not, create it
    if (!menuData.menu[0].addDish || !Array.isArray(menuData.menu[0].addDish)) {
      menuData.menu[0].addDish = [];
    }

    // Push the new dish to the addDish array
    menuData.menu[0].addDish.push({
      dishName,
      dishDetail,
      dishPrice,
      dishSize,
      dishType,
      dishCategory,
      dishImage
    });

    // Update the specific array element using updateOne
    await productuploadDetails.updateOne(
      { 'menu._id': _id },
      { $set: { 'menu.$.addDish': menuData.menu[0].addDish } }
    );

    console.log("Dish added bro .................", menuData);

    res.status(201).json({ message: 'Dish added to restaurant successfully' });
    console.log("Dish added");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
    console.log("Unable to add Dish");
  }
});

const DishDelete = asynchandler(async (req, res) => {
  try {
    const { menuId, _id } = req.params;

    console.log("This delete id is ...", menuId)
    const menuData = await productuploadDetails.findOne(
      { 'menu._id': menuId },
      { 'menu.$': 1 }
    );

    if (!menuData || !menuData.menu || !Array.isArray(menuData.menu[0].addDish)) {
     // return res.status(404).json({ message: 'Menu not found or addDish array does not exist' });
     console.error('Menu not found or addDish array does not exist:', menuData);
      return res.status(404).json({ message: 'Menu not found or addDish array does not exist' });

    }

    const removedItem = menuData.menu[0].addDish.find(
      (dish) => dish._id.toString() === _id.toString()
    );

    menuData.menu[0].addDish = menuData.menu[0].addDish.filter(dish => dish._id.toString() !== _id.toString());
    console.log("the dish id is",_id)

    await productuploadDetails.updateOne(
      { 'menu._id': menuId },
      { $set: { 'menu.$.addDish': menuData.menu[0].addDish } }
    );

    res.status(200).json({ message: 'Dish deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = { AddDishData,DishDelete };
