const express = require('express');
const view = express.Router();
const billSchema = require('../models/billModel');
const partiSchema = require('../models/partyModel')
const inventorySchema = require('../models/productSchema');
const userSchema = require('../models/userModel');

view.get('/', (req, res)=>{
    res.redirect('/chalan-list')
});
view.get('/new-chalan',async (req, res)=>{
    const parti = await partiSchema.find().select("_id name");
    // console.log(parti)
    res.render("newchalan", {parti})
});
view.get('/chalan-list', async (req, res)=>{
    let data = [];
    try{
        data = (await billSchema.find().select("-products")).reverse();
        // console.log(data);
        res.render("chalanlist", {data});
    }catch(err){
        res.render("error");
    }
    
})
view.get("/parti-master", async (req, res)=>{
    let data = []
    try{
        data = await partiSchema.find().select("-bills");
        // console.log(data);
        res.render("partimaster", {data});
    }catch(err){
        res.render("error");
    }
});
view.get("/chalan-view/:id", async (req, res)=>{
    const {id} = req.params;
    try{
        // console.log(id)
    const data = await billSchema.findOne({_id: id}).select("products chalanNo baleNo date partyName");
    console.log(data);
    res.render("chalanview",{data})
    }catch(err){
        res.render("error")
    }
    
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
view.get("/authorize-user", async (req, res)=>{
    try{
        const users = await userSchema.find().select("-password");
        // console.log(users);
        res.render("authorizeuser", {users});
    }catch(err){

    }
})
view.get('/parti-bill-view/:id', async (req, res)=>{
    const {id} = req.params;
    try{
        const data = await billSchema.find({partyId: id}).select("-products");
        // console.log(data);
        res.render("partibills", {data});
    }catch(err){
        console.log(err.message);
        res.render("error");
    }
});

view.get('/barcode', async (req, res)=>{
    try{
        const parti = await inventorySchema.find(); 
        console.log(parti)
        res.render("Barcode", {parti})
    }catch(err){
        res.render("error")
    }
})
module.exports = view;