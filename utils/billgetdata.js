const billSchema = require('../models/billModel');

exports.getBillData = async (id)=>{
    const bill = await billSchema.findById(id).select('products');
    console.log(bill);
    let data = [];
    let status = bill.billStatus;
    console.log("status : ", status)
    bill.products.forEach((ele)=>{
        console.log(ele.name)
        ele.quality.forEach((item)=>{
            data.push({
                name: ele.name,
                item: {
                    size: item.size,
                    count: item.count
                }
            })
        })
    });
    return {data, id, status};
}