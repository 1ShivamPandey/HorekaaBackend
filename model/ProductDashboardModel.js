const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema(
  {
    productName: { type: String, required: true },
    productPrice: { type: String, required: true },
    productQuantity: { type: String, required: true },
    productDetails: { type: String, required: true },
    productCategory: { type: String, required: true },
    productSize: { type: String, required: true },
    productImage: { type: String, required: true },

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

const productuploadDetails = mongoose.model("ProductuploadDashboard", ProductSchema);
module.exports = productuploadDetails;
