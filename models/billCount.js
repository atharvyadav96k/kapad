const mongoose = require('mongoose');

const billSchema = mongoose.Schema({
    count : {
        type: Number
    }
})

module.exports = mongoose.model('billcounts', billSchema);