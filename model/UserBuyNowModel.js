const mongoose = require("mongoose");
const buyNowSchema = mongoose.Schema(
    {
      productId: { type: String,  },
      name: { type:String  },
      price: { type: String,  },
      size: { type: String,  },
      quantity: { type: String,  },
      pincode: { type: String,  },
      address: { type: String,  },
    },
  );
  
  const buySchema =  mongoose.Schema({
    number: String,
    items: [buyNowSchema],
  });
  
const buynow = mongoose.model('buynow', buySchema);
module.exports = buynow;
  