const express = require("express");
const {productUpload,GetProductData,} = require("../Controllers/DashboardControllers");
// const {OrderData} = require('../Controllers/DashboardOrderscontroller')

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


// router.route("/Orders").get(OrderData);
// router.route('/sendotp').post(sendOTP);
//router.route('/login').post(authUser);
// router.route('/:number').get(getUserProfile);

module.exports = router;
