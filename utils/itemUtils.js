const itemSchema = require('../models/productSchema');

exports.get = async (req, res) => {
    try {
        const items = await itemSchema.find().select("_id name");
        return res.status(201).json({
            items
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};

exports.add = async (req, res) => {
    const { name } = req.body;
    try {
        const newItem = new itemSchema({ name });
        await newItem.save();
        return res.status(202).json({
            newItem
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};

exports.edit = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
        const item = await itemSchema.findById(id);
        item.name = name;
        await item.save();
        return res.status(203).json({
            message: "Edited successfully"
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};

exports.delete = async (req, res) => {
    const { id } = req.params;
    console.log("Hello")
    console.log(id)
    try {
        await itemSchema.findByIdAndDelete(id);
        return res.status(203).json({
            message: "Deleted successfully"
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
};
