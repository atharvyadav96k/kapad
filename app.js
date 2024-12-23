const express = require('express');
const app = express();
const compression = require('compression')
const bodyParser = require('body-parser');
const partyRouter = require('./router/partyRouter');
const userRouter = require('./router/userRouter')
const billRouter = require('./router/billRouter');
const productRouter = require('./router/productRouter');
const itemRouter = require('./router/itemRouter');
const dashboardUtils = require('./utils/dashboard');
const partyPage = require('./utils/partyPage');
const billPage = require('./utils/billPage');
const billDataUtil = require('./utils/billgetdata');
const barcode = require('./utils/generateBarcode');
const barcodeRouter = require('./router/barcodeRouter');
const billCount = require('./models/billCount');
const baleCount = require('./models/baleNoCount');
const viewRouter = require('./router/viewRouter')

const database = require('./connections/mongooseConnect');
require('dotenv').config();

database.connect();

app.set('view engine', 'ejs');

app.use(compression());
app.use(express.static('public'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', viewRouter);
app.use('/u', userRouter);
app.use('/party', partyRouter);
app.use('/bill', billRouter);
app.use('/product', productRouter);
app.use('/item', itemRouter);
app.use('/barcode', barcodeRouter);

app.get('/bill-data/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const data = await billDataUtil.getBillData(id);
        return res.status(200).json({data: data.data})
    } catch (err) {
        return res.render('error', { code: 500, message: err.message });
    }
});

app.get('/getChalanNo', async (req, res) => {
    try {
        const count = await billCount.findOne();
        if (count) {
            return res.status(200).json({ data: count });
        }else{
            const newCount = new billCount({
                count: 1,
                date: new Date()
            })
            await newCount.save();
            // console.log(newCount);
            return res.status(200).json({data: {count: 1, date: new Date()}});
        }
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Something went wrong" });
    }
})
app.get('/getBaleNo', async (req, res) => {
    try {
        const count = await baleCount.findOne();
        console.log(count);
        if (count) {
            return res.status(200).json({ data: count });
        }else{
            const newCount = new baleCount({
                count: 1,
                date: new Date()
            })
            await newCount.save();
            return res.status(200).json({data: {count: 1, date: new Date()}});
        }
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Something went wrong" });
    }
})


app.get('*', (req, res) => {
    res.status(500).json({message: "wrong url"});
})

app.listen(process.env.PORT, async () => {
    console.log(`app is running on port ${process.env.PORT}`);
    const open = (await import('open')).default;
});