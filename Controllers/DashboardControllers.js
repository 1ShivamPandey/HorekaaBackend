const asynchandler = require("express-async-handler");
const productuploadDetails = require("../model/ProductDashboardModel");

const productUpload = asynchandler(async (req, res) => {
  const { RestaurantName, RestaurantCategory, RestaurantDetail, pause } =
    req.body;

  const productImage = req.file.path;

  if (
    !RestaurantName ||
    !RestaurantCategory ||
    !RestaurantDetail ||
    !productImage
  ) {
    res.status(400);
    throw new Error("Please enter all the Restaurant details");
  }

  const ProductData = await productuploadDetails.create({
    RestaurantName,
    RestaurantCategory,
    RestaurantDetail,
    productImage,
    pause: false,
  });

  if (ProductData) {
    res.status(201).json({
      _id: ProductData._id,
      RestaurantName: ProductData.name,
      RestaurantCategory: ProductData.Category,
      RestaurantDetail: ProductData.Detail,
      productImage: ProductData.Image,
    });
    console.log("Done ");
  } else {
    res.status(400);
    console.log("Unable to to make");
    throw new Error("Failed to upload the product");
  }
});

const Pauserestaurant = asynchandler(async (req, res) => {
  try {
    const { _id } = req.params;
    console.log("Restaurant id is ", _id);

    const RestaurantData = await productuploadDetails.findOne({ _id });
    console.log("Restaurant Found:...........", RestaurantData);

    await productuploadDetails.findOneAndUpdate({ _id }, { pause: true });
  } catch (error) {
    console.log(error);
  }
});

const PauseRestaurantRemoved = asynchandler(async (req, res) => {
  try {
    const { _id } = req.params;
    console.log("Restaurant id is ", _id);

    const RestaurantData = await productuploadDetails.findOne({ _id });
    console.log("Restaurant Found:...........", RestaurantData);

    await productuploadDetails.findOneAndUpdate({ _id }, { pause: false });
  } catch (error) {
    console.log(error);
  }
});

const DeleteMenu = asynchandler(async (req, res) => {
  try {
    const { restaurantId, _id } = req.params;
    console.log("Menu id is ", _id, restaurantId);
    const RestaurantData = await productuploadDetails.findOneAndUpdate(
      { _id: restaurantId, "menu._id": _id },
      { $pull: { menu: { _id: _id } } },
      { new: true }
    );

    console.log("menuData is ", RestaurantData);
    if (!RestaurantData) {
      return res.status(404).json({ message: "Menu not found" });
    }
    console.log("Menu deleted:", RestaurantData);
    res.status(200).json({ message: "Menu deleted successfully" });
  } catch (error) {
    console.log(error);
  }
});

const GetProductData = asynchandler(async (req, res) => {
  try {
    const productData = await productuploadDetails.find();
    res.status(200).json({ ProductData: productData });
    console.log("Here is the product data", productData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
module.exports = {
  productUpload,
  GetProductData,
  Pauserestaurant,
  PauseRestaurantRemoved,
  DeleteMenu,
};
