const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    quantity: [{
      size: {
        type: String,
        required: true
      },
      count: {
        type: Number,
        required: true,
        min: 0
      }
    }]
  });
  
  const Product = mongoose.model('products', productSchema);
  
  module.exports = Product;  