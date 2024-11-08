const partySchema = require('../models/partyModel');

exports.bill = async (id) => {
    let name = "";
    let ids = [];
    let date = [];
    let billNo = [];
    let status = [];
    let userId = id;
    const user = await partySchema.findById(id).populate('bills');
    if (!user) {
        throw new Error('Party not found');
    }
    name = user.name;
    user.bills.forEach((u) => {
        ids.push(u._id);
        date.push(u.date);
        billNo.push(u.billNumber)
        if(u.billStatus == 0){
            status.push("Draft")
        }else if(u.billStatus == 1){
            status.push("Pending")
        }else{
            status.push("Complete");
        }
    });
    ids.reverse();
    date.reverse();
    billNo.reverse();
    status.reverse();
    return {
        name,
        id: ids,
        date,
        billNo,
        userId
    };
};
