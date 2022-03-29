const mongoose = require("mongoose");

const stuffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: String, required: true },
  price: { type: Number, required: true },
  quality: String,
});

module.exports = mongoose.model("Stuff", stuffSchema);
