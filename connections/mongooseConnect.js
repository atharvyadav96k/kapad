const mongoose = require('mongoose');

exports.connect = async ()=>{
    await mongoose.connect('mongodb://localhost:27017/kapad').then(()=>{
        console.log("data base connectd")
    }).catch((err)=>{
        console.log(`error : ${err.message}`)
    })
}   