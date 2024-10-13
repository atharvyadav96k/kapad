const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  billNumber: {
    type: String,
    required: true,
    unique: true
  },
  billStatus :{
    type: Number,
    default: 0
  },
  date: {
    type: Date,
    default: Date.now()
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
