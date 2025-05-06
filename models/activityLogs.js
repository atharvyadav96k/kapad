const mongoose = require('mongoose');

const logsSchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    entryType: {
        type: String,
        enum: ['received', 'delivered', 'dismantled'],
        required: true
    },
    party: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'partys'
    },
    chalanId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bills'
    },
    productQuantity: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('productLogs', logsSchema);
