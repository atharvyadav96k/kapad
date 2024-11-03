const express = require('express');
const itemRouter = express.Router();
const itemUtils = require('../utils/itemUtils');

itemRouter.get('/get', itemUtils.get);

itemRouter.post('/add', itemUtils.add);

itemRouter.post('/delete/:id', itemUtils.delete);

itemRouter.post('/edit/:id', itemUtils.edit);

module.exports = itemRouter;