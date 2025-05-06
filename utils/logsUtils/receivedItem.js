const productEntrySchema = require('../../models/productEntry');
const productLogsSchema = require('../../models/activityLogs'); 
const mongoose = require('mongoose');

exports.receive = async (productId, quantity) => {
    let logEntry;
    if (
        !mongoose.Types.ObjectId.isValid(productId)
    ) {
        return {
            success: false,
            message: 'Invalid ObjectId provided.',
            status: 400
        };
    }
    try {
        logEntry = new productLogsSchema({
            productId,
            entryType: 'received',
            productQuantity: quantity
        });

        await logEntry.save();

        let product = await productEntrySchema.findOne({ productId });

        if (!product) {
            product = new productEntrySchema({
                productId,
                currentQuantity: 0
            });
        }

        product.currentQuantity += parseFloat(quantity);

        await product.save();

        return {
            success: true,
            message: 'Product entry and log created successfully.',
            product
        };

    } catch (err) {
        if (logEntry && logEntry._id) {
            await productLogsSchema.findByIdAndDelete(logEntry._id);
        }

        return {
            success: false,
            message: 'Operation failed. Rolled back log.',
            error: err.message
        };
    }
};
