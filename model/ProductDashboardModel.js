const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    RestaurantName: { type: String, required: true },
    RestaurantCategory: { type: String, required: true },
    RestaurantDetail:{type:String,required:true},
    productImage: { type: String, required: true },
    pause:{type:Boolean},
    menu:[{ menuId: String, menuName: String, menuDetail: String, addDish:[{dishName:String,dishDetail:String,dishPrice:String,dishSize:String,dishType:String,dishCategory:String,dishImage:String}] }],
  },
  { timestamps: true } // this adds created and update time timestamps is mongoose reserved keyword
);

ProductSchema.pre("save", async function (next) {
  if (!this.isModified) {
    next();
    console.log("Product detail is saved");
  }
  console.log("save pta nahi");
});

//====================================================  Upload  ===========================================================

const productuploadDetails = mongoose.model("Restaurant", ProductSchema);
module.exports = productuploadDetails;
