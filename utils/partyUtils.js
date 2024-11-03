const partySchema = require('../models/partyModel');

exports.getParty = async (req, res) => {
    try {
        const party = await partySchema.find().select('_id name');
        return res.status(200).json(party);
    }catch(err){
        return res.status(500).json({
            error: err.message
        })
    }
}
exports.create = async (req, res) => {
    const { name } = req.body;
    try {
        const party = new partySchema({
            name: name
        });
        await party.save();
        return res.status(201).json({
            message: 'party created successfully'
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}
exports.edit = async (req, res) => {
    const { name } = req.body;
    const { id } = req.params;
    try {
        const party = await partySchema.findById(id);
        if (party) {
            party.name = name;
            await party.save();
            return res.status(202).json({
                message: 'updated successfully'
            });
        } else {
            return res.status(404).json({
                error: 'user not found'
            });
        }
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}
exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const party = await partySchema.findByIdAndDelete(id);
        if (party) {
            return res.status(201).json({
                message: 'user deleted successfully'
            })
        } else {
            return res.status(404).json({
                error: 'user not found'
            });
        }
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}