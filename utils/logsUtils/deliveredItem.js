const productEntrySchema = require('../../models/productEntry');
const productLogsSchema = require('../../models/activityLogs');
const partySchema = require('../../models/partyModel');
const itemSchema = require('../../models/billModel');

exports.deliver = async ({productId, quantity, partyId, chalanId})=>{
    let logEntry;
    try{
        let product;
        let party;
        let chalan;
        try{
            product = await productEntrySchema.findOne({productId});
            party = await partySchema.findOne({_id: partyId});
            chalan = await itemSchema.findOne({_id: chalanId});
        }catch(err){
            return {
                success: false,
                message: 'product or party or chalan not found',
                status: 404
            }
        }
        if(!product || !party || !chalan){
            return {
                success: false,
                message: `${!product ? 'product' : ! party ? 'party' : 'chalan'}` + ' required',
                status: 404
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
            entryType: 'delivered',
            productQuantity: quantity,
            party: partyId,
            chalanId
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