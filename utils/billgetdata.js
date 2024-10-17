const billSchema = require('../models/billModel');

exports.getBillData = async (id)=>{
    const bill = await billSchema.findById(id).select('product');
    console.log(bill);
    let data = [];
    bill.product.forEach((ele)=>{
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
    // console.log(data)
    return {data, id};
}