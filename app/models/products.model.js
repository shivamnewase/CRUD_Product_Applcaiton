var mongoose = require("mongoose");

var ProductSchema = mongoose.Schema(
  {
    name: String,
    price: Number,
    brand: String,
    isActive: Boolean,
    location: String,
    visiblearea: Array,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema);
