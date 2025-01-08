const partySchema = require('../models/partyModel');
const billSchema = require('../models/billModel');

exports.dashBoardData = async ()=>{
    const party = await partySchema.find();
    const  draft = await billSchema.find({billStatus: 0});
    const  delivered = await billSchema.find({billStatus: 2});
    const pending = await billSchema.find({billStatus: 1});

    const partyCount = party.length;
    const deliveredCount = delivered.length;
    const pendingCount = await pending.length;
    const draftCount = draft.length;

    return {
        partys: partyCount,
        delivered: deliveredCount,
        pending: pendingCount,
        draft: draftCount
    }
}