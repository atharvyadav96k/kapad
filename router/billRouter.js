const express = require('express');
const router = express.Router();
const Bills = require('../models/billModel'); // Adjust the path as needed
const countSchema = require('../models/billCount');
const baleSchema = require('../models/baleNoCount')
const createCount = async (chalanNo) => {
    const count = await countSchema.findOne();
    if(count){
        count.count = parseInt(chalanNo)+1;
        count.date = new Date();
        count.save();
        return count;
    }else{
        const newCount = countSchema({
            count : chalanNo,
            date: new Date()
        })
        await newCount.save();
        return ({
            count: chalanNo,
            date: new Date()
        })
    }
}
const baleCount = async (baleNo) => {
    const count = await baleSchema.findOne();
    if(count){
        count.count = parseInt(baleNo)+1;
        count.date = new Date();
        count.save();
        return count;
    }else{
        const newCount = baleSchema({
            count : baleNo,
            date: new Date()
        })
        await newCount.save();
        return ({
            count: baleNo,
            date: new Date()
        })
    }
}
router.post('/bills', async (req, res) => {
    const { id, partyName, chalanNo, baleNo, date, product } = req.body;
    try {
        const newBill = new Bills({ partyId: id, partyName, chalanNo, baleNo, date, product });
        const savedBill = await newBill.save();
        await createCount(chalanNo);
        await baleCount(baleNo);
        res.status(201).json({ message: 'Bill created successfully', savedBill });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating bill', error });
    }
});


router.get('/bills', async (req, res) => {
    try {
        const bills = await Bills.find().populate('parti');
        res.status(200).json(bills);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching bills', error });
    }
});

router.get('/data/:id', async (req, res) => {
    const {id} = req.params;
    // console.log(id)
    try{
        const data = await Bills.find({partyId: id}).select('-products');
        if(data){
            data.reverse();
        }
        // console.log(data)
        return res.status(200).json({
            data: data
        });
    }catch(err){
        console.log(err.message)
        return res.status(500).json({message: err.message})
    }
});
router.post('/bill-data/:id', async(req, res)=>{
    const {id} = req.params;
    console.log("jjsj")
    const {partyId, partyName, baleNo, chalanNo, date} = req.body;
    console.log(partyId)
    try{
        const dbaleNo = await Bills.find({baleNo});
        const dchalanNO = await Bills.find({chalanNo});
        if(dbaleNo.length > 1) return res.status(500).json({message: "Duplicate Bale NO"});
        if(dchalanNO.length > 1) return res.status(500).json({message: "Duplicate Chalan NO"});
        const bill = await Bills.findOne({_id: id});
        bill.partyName = partyName;
        bill.partyId = partyId;
        bill.chalanNo = chalanNo;
        bill.baleNo = baleNo;
        bill.date = date;
        await bill.save();
        return res.status(200).json({message: "Updated successfully"})
    }catch(err){
        console.log(err.message);
        return res.status(500).json({message: "failed to update"});
    }
})

router.get('/bill-data/:id', async(req, res)=>{
    const {id} = req.params;
    console.log(id)
    try{
        const bill = await Bills.findOne({_id: id}).select('-quality -products');
        if(!bill) return res.status(404).json({message: "Bill not found"})
        return res.status(200).json({data: bill})
    }catch(err){
        res.status(500).json({message: "Bill not found"});
    }
})
router.put('/bills/:id', async (req, res) => {
    const { id } = req.params;
    const { parti, chalanNo, BaleNo, date, product } = req.body;

    try {
        const updatedBill = await Bills.findByIdAndUpdate(
            id,
            { parti, chalanNo, BaleNo, date, product },
            { new: true, runValidators: true }
        );
        if (!updatedBill) return res.status(404).json({ message: 'Bill not found' });
        res.status(200).json({ message: 'Bill updated successfully', updatedBill });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating bill', error });
    }
});


router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id)
    try {
        const deletedBill = await Bills.findByIdAndDelete(id);
        if (!deletedBill) return res.status(404).json({ message: 'Bill not found' });
        res.status(200).json({ message: 'Bill deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting bill', error });
    }
});

module.exports = router;