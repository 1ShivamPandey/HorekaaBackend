const express = require('express');
const {AddDishData,DishDelete} = require ('../Controllers/AddDishesController')
//const router = express.Router()
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

const router = express.Router();
router.route('/list').post(upload.single("dishImage"), AddDishData);
router.route('/list/delete/:menuId/:_id').delete(DishDelete)

module.exports = router;
