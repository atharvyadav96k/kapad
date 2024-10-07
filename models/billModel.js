const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  billNumber: {
    type: String,
    required: true,
    unique: true
  },
  product: [{
    name: String,
    quality: [
      {
        size: Number,
        count: Number 
      }
    ]
  }]
});

module.exports = mongoose.model('Bills', billSchema);  
