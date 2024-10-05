const express = require('express');
const productRouter = express.Router();
const productUtils = require('../utils/productUtils');

productRouter.get('/get/:id', productUtils.get);

productRouter.post('/create/:id', productUtils.create);

productRouter.post('/edit/:id', productUtils.edit);

productRouter.post('/delete/:id', productUtils.delete);

module.exports = productRouter;