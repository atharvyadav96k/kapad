const express = require('express');
const productRouter = express.Router();
const productUtils = require('../utils/productUtils');

productRouter.get('/get/:id', productUtils.get);

productRouter.post('/add/:id', productUtils.add);

productRouter.post('/addremark/:id', productUtils.addremark);

productRouter.post('/edit/:id', productUtils.edit);

productRouter.post('/deleteName/:id', productUtils.deleteByName);

productRouter.post('/deleteSize/:id', productUtils.deleteQuality);

productRouter.post('/getAll/:page', productUtils.getAll);

productRouter.post('/getSearch/:chalaNo', productUtils.getSearch);

module.exports = productRouter;