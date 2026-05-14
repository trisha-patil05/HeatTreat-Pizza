const mongoose = require('mongoose');

const pizzaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  sizes: [{ type: String }],
  toppings: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Pizza', pizzaSchema);
