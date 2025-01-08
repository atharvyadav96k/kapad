const express = require('express');
const barcode = express.Router();
const {generateBarCodePage} = require('../utils/generateBarcode');

barcode.post('/', async (req,res)=>{
    const {data, brand} = req.body;
    try {
        // const barcodeBuffer = await generateQRCode(data);
        // res.setHeader('Content-Type', 'image/png');
        const barcodeBuffer = await generateBarCodePage(data);
        res.setHeader('Content-Type', 'image/png');
        res.send(barcodeBuffer);
    } catch (err) {
        console.error('Error generating barcode:', err);
        res.status(500).send('Error generating barcode');
    }
})

module.exports = barcode;