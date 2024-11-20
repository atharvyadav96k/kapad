const billSchema = require('../models/billModel');

exports.getBillData = async (id)=>{
    const bill = await billSchema.findById(id).select('products');
    // console.log(bill);
    let data = [];
    let status = bill.billStatus;
    bill.products.forEach((ele)=>{
        // console.log(ele.name)
        ele.quality.forEach((item)=>{
            data.push({
                name: ele.name,
                item: {
                    size: item.size,
                    count: item.count
                },
                remark: ele.remark == undefined ? "" : ele.remark
            })
        })
    });
    return {data, id, status};
}