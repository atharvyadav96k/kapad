const express = require('express');
const bill = express.Router();
const billUtils = require('../utils/billUtils');

bill.get('/get/:id', billUtils.get);

bill.post('/create/:id', billUtils.create);

bill.post('/edit/:id', billUtils.edit);

bill.post('/delete/:id', billUtils.delete);