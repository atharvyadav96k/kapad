const express = require('express');
const transactions = express.Router();
const productEntrySchema = require('../models/productEntry');
const { receive } = require('../utils/logsUtils/receivedItem');
const { deliver } = require('../utils/logsUtils/deliveredItem');
const { dismantle } = require('../utils/logsUtils/dismantledItem');
const { ObjectId } = require('mongoose').Types;
const Logs = require('../models/activityLogs');

transactions.get('/logs/chart', async (req, res) => {
    try {
        let logs = await Logs.find()
            .sort({ createdAt: -1 })
            .limit(50)
            .select('entryType productQuantity');

        const extractLogs = (logs, type) => {
            const filtered = logs
                .filter(item => item.entryType === type && item.productQuantity !== 0)
                .map(item => item.productQuantity);

            return filtered;
        };

        const receiveLogs = extractLogs(logs, 'received');
        const deliveredLogs = extractLogs(logs, 'delivered');
        const dismantledLogs = extractLogs(logs, 'dismantled');

        res.status(200).json({
            receiveLogs,
            deliveredLogs,
            dismantledLogs,
        });
    } catch (err) {
        console.log(err.message)
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        })
    }
});


transactions.get('/logs/:productId/:page', async (req, res) => {
    const pageNo = parseInt(req.params.page);
    const limit = 100;
    const { productId } = req.params;

    if (isNaN(pageNo) || pageNo < 0) {
        return res.status(400).json({
            success: false,
            message: "Page number must be a non-negative integer.",
        });
    }

    const skip = pageNo * limit;

    try {
        let count = 0;
        let logs = [];
        let productQuantity;
        if (productId === 'all') {
            count = await Logs.countDocuments();
            logs = await Logs.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate({ path: 'productId', select: 'name _id' })
                .populate({ path: 'party', select: 'name _id', options: { strictPopulate: false } })
                .populate({ path: 'chalanId', select: 'chalanNo baleNo', options: { strictPopulate: false } });
        } else {
            // console.log(productId)
            const id = new ObjectId(productId);
            // console.log(id);
            if (!id) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid productId provided.",
                });
            }
            productQuantity = await productEntrySchema.findOne({productId: id}).populate({path: "productId", select: "name -_id"}).select("currentQuantity");
            count = await Logs.countDocuments({ productId: id });
            logs = await Logs.find({productId: id, 
                entryType: 'delivered'})
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate({ path: 'productId', select: 'name _id' })
                .populate({ path: 'party', select: 'name _id', options: { strictPopulate: false } })
                .populate({ path: 'chalanId', select: 'chalanNo baleNo', options: { strictPopulate: false } });
        }
        console.log(productQuantity)
        return res.status(200).json({
            success: true,
            message: `Logs for page ${pageNo}`,
            logs,
            totalPages: Math.ceil(count / limit),
            totalLogs: count,
            productQuantity
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: err.message,
        });
    }
});

transactions.get('/entry/:productId/:limit/:page',async (req, res)=>{
    const pageNo = parseInt(req.params.page);
    const limit = parseInt(req.params.limit);
    const productId = req.params.productId;
    console.log(productId)
    console.log("request", pageNo, limit);
    if (pageNo < 0) {
        return res.status(400).json({
            success: false,
            message: "Page number is required and must be a non-negative number.",
        });
    }

    const skip = pageNo * limit;
    try{
        const count = await productEntrySchema.countDocuments();
        let entrys;
        if(productId == "all"){
            entrys = await productEntrySchema.find()
                                               .sort({updatedAt: -1})
                                               .skip(skip)
                                               .limit(limit)
                                               .populate({path: 'productId', select: 'name _id currentQuantity'});
        }else{
            entrys = await productEntrySchema.find({productId})
                                               .sort({updatedAt: -1})
                                               .skip(skip)
                                               .limit(limit)
                                               .populate({path: 'productId', select: 'name _id currentQuantity'});
        }
        return res.status(200).json({
            message: "Entry of page "+ pageNo,
            success: true,
            entrys,
            totalPages: Math.ceil(count / limit),
            totalLogs: count
        });
    }catch(err){
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message
        });
    }
});

transactions.post('/received', async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const response = await receive(productId, quantity);
        if (!response.success) {
            return res.status(300).json(response);
        }
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: err.message
        });
    }
});

transactions.post('/delivered', async (req, res) => {
    try {
        const { productId, quantity, partyId, chalanId } = req.body;
        const response = await deliver({ productId, quantity, partyId, chalanId });
        if (!response.success) {
            return res.status(response.status).json(response);
        }
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: err.message
        });
    }
});

transactions.post('/dismantled', async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const response = await dismantle({ productId, quantity });
        if (!response.success) {
            return res.status(response.status).json(response);
        }
        return res.status(200).json(response);
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: err.message
        });
    }
})
module.exports = transactions;