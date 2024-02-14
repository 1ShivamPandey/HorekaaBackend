const express = require("express");
const {productUpload,GetProductData,Pauserestaurant,PauseRestaurantRemoved,DeleteMenu} = require("../Controllers/DashboardControllers");

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// const storage = multer.diskStorage({
//   destination: "./public/data/uploads/",
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

const upload = multer({ storage });
const router = express.Router();
router.route("/productupload").post(upload.single("productImage"), productUpload).get(GetProductData);
router.route("/pauseRestaurant/:_id").post(Pauserestaurant)
router.route("/pauseRestaurantRemoved/:_id").post(PauseRestaurantRemoved)
router.route("/deleteMenu/list/delete/:restaurantId/:_id").delete(DeleteMenu)


module.exports = router;
