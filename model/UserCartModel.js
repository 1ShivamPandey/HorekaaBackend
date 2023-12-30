const mongoose = require("mongoose");
const cartItemSchema = mongoose.Schema(
    {
      productId: { type: String,  },
      name: { type:String  },
      price: { type: String,  },
    },
  );
  
  const cartSchema =  mongoose.Schema({
    number: String,
    items: [cartItemSchema],
  });
  
const cart = mongoose.model('cart', cartSchema);
module.exports = cart;
  