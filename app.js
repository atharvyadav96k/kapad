const express = require('express');
const app = express();
require('dotenv').config();



app.get('/', (req, res)=>{
    res.send("Mother Father")
})
app.listen(process.env.PORT, ()=>{
    console.log(`app is running on port ${process.env.PORT}`)
})