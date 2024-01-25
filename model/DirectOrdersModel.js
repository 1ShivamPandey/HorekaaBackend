const mongoose = require("mongoose");
const DirectOrdersSchema = mongoose.Schema(
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
  
  const directOrders=mongoose.Schema({
    name:String,
    number:String,
    Shippingstatus:String,
    items: [DirectOrdersSchema],
  });
  
const directorders = mongoose.model('directorders', directOrders);
module.exports = directorders;
  