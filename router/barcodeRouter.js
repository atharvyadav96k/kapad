const express = require('express');
const barcode = express.Router();
const barcodeGenerate = require('../utils/generateBarcode');

barcode.post('/', async (req,res)=>{
    const {data, brand} = req.body;
    try {
        const barcodeBuffer = await barcodeGenerate.generateQRCode(data, brand);
        res.setHeader('Content-Type', 'image/png');
        res.send(barcodeBuffer);
    } catch (err) {
        console.error('Error generating barcode:', err);
        res.status(500).send('Error generating barcode');
    }
})

module.exports = barcode;