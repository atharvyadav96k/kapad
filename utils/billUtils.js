const billSchema = require('../models/billModel');
const BillCount = require('../models/billCount');
const Party = require('../models/partyModel');
const partyModel = require('../models/partyModel');

exports.get = async (req, res) => {
    console.log(id)
    try {
        const bills = await partyModel.findById(id).populate('bills');
        return res.status(200).json(bills)
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

exports.create = async (req, res) => {
    const { id } = req.params;
    let no;
    try {
        const party = await Party.findById(id);
        if (!party) {
            return res.status(404).json({
                error: 'Party not found'
            });
        }

        no = await inBillCount();
        const newBill = new billSchema({
            billNumber: no
        });

        await newBill.save();
        if (!Array.isArray(party.bills)) {
            party.bills = [];
        }

        party.bills.push(newBill._id);
        await party.save();

        return res.status(201).json({
            message: "Bill created successfully",
            bill: newBill
        });
    } catch (err) {

        if (no) {
            await deBillCount();
        }
        return res.status(500).json({
            error: err.message
        });
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

const deBillCount = async () => {
    try {
        const count = await BillCount.findOne();
        if (count) {
            count.count -= 1;
            await count.save();
            return count.count;
        }
    } catch (err) {
        console.error('Error reducing bill count:', err);
        throw err;
    }
};
