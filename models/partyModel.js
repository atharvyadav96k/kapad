const mongoose = require('mongoose');

const partySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  bills: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bills'
  }]
});

module.exports = mongoose.model('partys', partySchema);