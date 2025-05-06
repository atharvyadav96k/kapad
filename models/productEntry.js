const mongoose = require('mongoose');

const productEntrySchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    currentQuantity: {
        type: Number,
        required: true,
    }
},{
    timestamps: true
});

module.exports = mongoose.model('productEntrys', productEntrySchema);