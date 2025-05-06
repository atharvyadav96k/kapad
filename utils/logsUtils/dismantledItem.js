const productEntrySchema = require('../../models/productEntry');
const productLogsSchema = require('../../models/activityLogs');

exports.dismantle = async ({productId, quantity})=>{
    let logEntry;
    try{
        let product;
        try{
            product = await productEntrySchema.findOne({productId});
        }catch(err){
            return {
                success: false,
                message: 'product',
                status: 404
            }
        }
        if(!product){
            return {
                success: false,
                message: 'Insufficient items',
                status: 404,
                items: 0
            }
        }
        if(product.currentQuantity < quantity){
            return {
                success: false,
                message: 'Insufficient Item',
                status: 300,
                items: product.currentQuantity
            }
        }
        logEntry = new productLogsSchema({
            productId,
            entryType: 'dismantled',
            productQuantity: quantity,
        });
        logEntry.save();
        product.currentQuantity -= parseFloat(quantity);
        await product.save();
        return {
            success: true,
            message: 'Product exit and logs created successfully',
            product,
            status: 200
        }
    }catch(err){
        // Rolled back
        if(logEntry && logEntry._id){
            await productLogsSchema.findByIdAndDelete(logEntry._id);
        }
        return {
            success: false,
            message: 'Operation failed. Rolled back log',
            error: err.message,
            status: 300
        }
    }
}