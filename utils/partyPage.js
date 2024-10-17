const partySchema = require('../models/partyModel');
const billSchema = require('../models/billModel');

exports.partyPage = async () => {
    let party = [];
    let pending = [];
    let draft = [];
    let delivered = [];
    let id = [];
    const users = await partySchema.find();

    for (const p of users) {
        party.push(p.name);
        let pCount = 0;
        let dCount = 0;
        let cCount = 0;
        id.push(p._id);
        if (p.bills) {
            for (const b of p.bills) {
                try {
                    const bill = await billSchema.findById(b);
                    if (bill) {
                        if (bill.billStatus === 0) {
                            dCount++;
                        }
                        if (bill.billStatus === 1) {
                            pCount++;
                        }
                        if (bill.billStatus === 2) {
                            cCount++;
                        }
                    }
                } catch (err) {
                    console.error('Error fetching bill:', err);
                }
            }
        }
        pending.push(pCount);
        draft.push(dCount);
        delivered.push(cCount);
    }

    // console.log(party);
    return {
        party,
        pending,
        draft,
        delivered,
        id
    };
};
