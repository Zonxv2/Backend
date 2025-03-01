const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  productos: [
    {
      producto: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      cantidad: { type: Number, default: 1 },
    },
  ],
});

const CartModel = mongoose.model("Cart", cartSchema);

module.exports = CartModel;
