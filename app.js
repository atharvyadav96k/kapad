const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const partyRouter = require('./router/partyRouter');
const userRouter = require('./router/userRouter')
const billRouter = require('./router/billRouter');

const database = require('./connections/mongooseConnect');
require('dotenv').config();

database.connect();

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/u', userRouter);
app.use('/party', partyRouter);
app.use('/bill', billRouter);

app.get('/', (req, res)=>{
    res.render('index')
});


app.listen(process.env.PORT, ()=>{
    console.log(`app is running on port ${process.env.PORT}`);
});