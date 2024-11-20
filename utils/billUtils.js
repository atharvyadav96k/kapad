const billSchema = require('../models/billModel');
const BillCount = require('../models/billCount');
const Party = require('../models/partyModel');
const partyModel = require('../models/partyModel');
const chalanSchema = require('../models/chalanCount');

exports.get = async (req, res) => {
    // console.log(id)
    const { id } = req.params;
    try {
        const bills = await partyModel.findById(id).populate('bills');
        // console.log(bills)
        return res.status(200).json(bills);
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: err.message });
    }
}

exports.create = async (req, res) => {
    const { id } = req.params;
    const { parti, chalanNo, baleNo, Date } = req.params;
    try {
        const isParty = await partyModel.findById(parti);
        if (isParty) {
            const newBill = billSchema({

            })
        } else {
            return res.status(404).json({ message: 'user not found' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        const bill = await billSchema.findById(id);
        if (!bill) {
            return res.status(404).json({
                error: 'Bill not found'
            });
        }
        const party = await partyModel.findOne({ product: id });
        if (party) {
            party.bills = party.bills.filter(billId => billId.toString() !== id);
            await party.save();
        }
        await partyModel.updateMany(
            { bills: bill._id },
            { $pull: { bills: bill._id } }
        )
        await billSchema.findByIdAndDelete(id);
        return res.status(200).json({
            message: 'Bill and associated reference in Party deleted successfully'
        });
    } catch (err) {
        return res.status(500).json({
            error: err.message
        });
    }
}

exports.status = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // console.log(status, id)
    // Check if the status is valid
    if (!(status >= 0 && status <= 2)) {
        return res.status(400).json({
            error: "Invalid Status"
        });
    }

    try {
        // Find the bill by ID
        const bill = await billSchema.findById(id);
        if (bill) {
            bill.billStatus = status;
            await bill.save();
            return res.status(200).json({
                message: `Status changed to ${status}`
            });
        } else {
            return res.status(404).json({
                error: "Bill not found"
            });
        }
    } catch (err) {
        // Log the error message (optional)
        console.error(err.message);
        return res.status(500).json({
            error: "An error occurred while updating the status."
        });
    }
};

exports.pending = async (req, res) => {
    try {
        const bills = await billSchema.find(
            { billStatus: { $in: [0, 1] } }
        );

        // console.log(bills);
        res.status(200).json({ bills });
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

const inBillCount = async () => {
    try {
        const count = await BillCount.findOne();
        if (count) {
            count.count += 1;
            await count.save();
            return count.count;
        } else {
            const newCount = new BillCount({ count: 1 });
            await newCount.save();
            return newCount.count;
        }
    } catch (error) {
        console.error('Error updating bill count:', error);
        throw error;
    }
};

const inChalanNo = async () => {
    try {
        const count = await chalanSchema.findOne();
        if (count) {
            count.count += 1;
            await count.save();
            return count.count;
        } else {
            const newChalan = new chalanSchema({ count: 1 });
            await newChalan.save();
            return newChalan.count;
        }
    } catch (err) {
        return res.status(500).json({message: err.message})
    }
}
