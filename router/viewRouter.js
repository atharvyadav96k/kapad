const express = require('express');
const view = express.Router();

view.get('/', (req, res)=>{
    res.render('index')
})

module.exports = view;