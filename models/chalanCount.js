const mongoose = require('mongoose');

const chalanSchema = mongoose.Schema({
    count : {
        type: Number
    }
});

module.exports = mongoose.model("chalans", chalanSchema);