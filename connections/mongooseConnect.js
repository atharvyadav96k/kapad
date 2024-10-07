const mongoose = require('mongoose');

exports.connect = async ()=>{
    await mongoose.connect(process.env.DATA_BASE_URL).then(()=>{
        console.log("data base connected");
    }).catch((err)=>{
        console.log(`error : ${err.message}`)
    })
}   