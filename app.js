const express = require('express');
const app = express();
const compression = require('compression')
const bodyParser = require('body-parser');
const partyRouter = require('./router/partyRouter');
const userRouter = require('./router/userRouter')
const billRouter = require('./router/billRouter');
const productRouter = require('./router/producrRouter');
const itemRouter = require('./router/itemRouter');
const dashboardUtils = require('./utils/dashboard');
const partyPage = require('./utils/partyPage');
const billPage = require('./utils/billPage');
const billDataUtil = require('./utils/billgetdata');
const barcode = require('./utils/generateBarcode');
const barcodeRouter = require('./router/barcodeRouter');
const billCount = require('./models/billCount');

const database = require('./connections/mongooseConnect');
require('dotenv').config();

database.connect();

app.set('view engine', 'ejs');

app.use(compression());
app.use(express.static('public'));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/u', userRouter);
app.use('/party', partyRouter);
app.use('/bill', billRouter);
app.use('/product', productRouter);
app.use('/item', itemRouter);
app.use('/barcode', barcodeRouter);
app.get('/', (req, res) => { res.render('index') })

app.get('/dashboard', async (req, res) => {
    try {
        const data = await dashboardUtils.dashBoardData();
        return res.render('dashboard', data)
    } catch (err) {
        return res.render('error', { code: 500, message: err.message })
    }
});
app.get('/party', async (req, res) => {
    try {
        const data = await partyPage.partyPage();
        return res.render('party', data)
    } catch (err) {
        console.log(err)
        return res.render("error", { code: 500, message: err.message })
    }

});

app.get('/bill/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const data = await billPage.bill(id);
        console.log(data)
        res.render("bill", data)
    } catch (err) {
        return res.render("error", { code: 500, message: err.message })
    }
})

app.get('/bill-data/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const data = await billDataUtil.getBillData(id);
        return res.status(200).json({data: data.data})
        // return res.render("billGet", { data: data.data, id: data.id, status: data.status });
    } catch (err) {
        return res.render('error', { code: 500, message: err.message });
    }
});

app.get('/getChalanNo', async (req, res) => {
    console.log("Hello")
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
            console.log(newCount);
            return res.status(200).json({data: {count: 1, date: new Date()}});
        }
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Something went wrong" });
    }
})


app.get('*', (req, res) => {
    res.render('error', { code: 404, message: "page your looking for is not found" })
})
app.listen(process.env.PORT, async () => {
    console.log(`app is running on port ${process.env.PORT}`);
    const open = (await import('open')).default;
});