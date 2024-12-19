const mongoose = require('mongoose');

const billSchema = mongoose.Schema({
    count : {
        type: Number
    },
    date: {
        type: Date,
        default: new Date()
    }
})

module.exports = mongoose.model('baleNo', billSchema);