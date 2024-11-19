const express = require('express');
const view = express.Router();
const billSchema = require('../models/billModel');
const partiSchema = require('../models/partyModel')
const inventorySchema = require('../models/productSchema');
view.get('/', (req, res)=>{
    res.redirect('/chalan-list')
});
view.get('/new-chalan', (req, res)=>{
    res.render("newchalan")
});
view.get('/chalan-list', async (req, res)=>{
    let data = [];
    try{
        data = (await billSchema.find().select("-products")).reverse();
        console.log(data);
        res.render("chalanlist", {data});
    }catch(err){
        res.render("error");
    }
    
})
view.get("/parti-master", async (req, res)=>{
    let data = []
    try{
        data = await partiSchema.find().select("-bills");
        console.log(data);
        res.render("partimaster", {data});
    }catch(err){
        res.render("error");
    }
});
view.get("/chalan-view/:id", async (req, res)=>{
    const {id} = req.params;
    console.log(id)
    const data = await billSchema.findOne({_id: id}).select("products chalanNo baleNo date partyName");
    console.log(data);
    res.render("chalanview",{data})
})
view.get("/inventory-master", async (req, res)=>{
    let data = [];
    try{
        data = await inventorySchema.find();
        res.render("inventorymaster", {data});
    }catch(err){
        res.render("error");
    }
})
view.get("/authorize-user", (req, res)=>{
    res.render("authorizeuser");
})

module.exports = view;