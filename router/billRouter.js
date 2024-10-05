const express = require('express');
const router = express.Router();
const billController = require('../utils/billUtils');

router.post('/create/:id', billController.create);

router.post('/delete/:id', billController.delete);

router.get('/get/:id', billController.get);

module.exports = router;
