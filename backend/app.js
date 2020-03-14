// #region variables 
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require("mongoose")
var user = require('./Models/user')
var category = require('./Models/category')
var product = require('./Models/product')
var financeaccount = require('./Models/financeaccount')
var financetransaction = require('./Models/financetransaction')
var userRouter = require('./routes/user');
var categoryRouter = require('./routes/category');
var productRouter = require('./routes/product');
var accountingRouter = require('./routes/accounting');
var app = express();
mongoose.connect('mongodb://localhost:27017/businessbook', {
  useNewUrlParser: true
});

app.use(bodyParser.json({
  limit: '100mb'
}))
app.use(bodyParser.urlencoded({
  limit: '100mb',
  extended: true
}));
var timeout = require('connect-timeout');
app.use(timeout('960000s'));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, PATCH, OPTIONS,DELETE");
  next()
});

app.use(express.static("public"));
global.chartofaccount = {}
var chartofaccount = {
  possaleaccount: null,
  cashaccount: null,
  csgaccount: null,
  inventoryaccount: null,
};
//dbsetting();
loadcharofaccount()
async function dbsetting() {
  await user.remove({});
  await category.remove({});
  await product.remove({});
  await financeaccount.remove({});
  await financetransaction.remove({});
  user.findOne({
    username: 'admin',
    role: 'admin'
  }).then(res => {
    if (!res) {
      const User = new user({
        address: '243 Queen St West Toranto',
        department: null,
        companyname: 'Jahayuu',
        companyimage: "/companyimage/defaultcompanyimage.png",
        companymessage: "Next Generation IT Development",
        createdDate: Date.now(),
        city: 'Lahore',
        country: 'Pakistan',
        designation: 'web admin',
        dateofbirth: Date.now(),
        email: "admin@admin.com",
        firstname: 'web',
        activestatus: 'active',
        lastname: 'admin',
        lastlogindate: Date.now(),
        personalphone: '923024759550',
        password: "admin@123",
        profileimage: "/profileimage/defaultprofileimage.png",
        role: 'admin',
        title: 'Mr',
        username: 'admin',
        workphone: '923024759550',
        website: 'www.jahayuu.com',
      })
      User.save();
      console.log('admin user added')
    } else {
      console.log('admin user exists')
    }
  }).catch(err => {
    console.log(err)
  })

  var Bewerage = new category({ name: "Bewerage" });
  await Bewerage.save();

  await product.create({ name: 'pepsi 250ml', purchaseprice: 20, saleprice: 25 })
  await product.create({ name: 'coke can 500ml', purchaseprice: 45, saleprice: 50 })


  // assets account
  chartofaccount.possaleccount = await financeaccount.create({ name: 'pos sale', type: 'income' });
  chartofaccount.cashaccount = await financeaccount.create({ name: 'cash', type: 'asset' });
  chartofaccount.csgaccount = await financeaccount.create({ name: 'cost of goods sold', type: 'expence' });
  chartofaccount.inventoryaccount = await financeaccount.create({ name: 'inventory', type: 'asset' });
  global.chartofaccount = chartofaccount;
}
async function loadcharofaccount() {
  chartofaccount.possaleaccount = await financeaccount.findOne({ name: "pos sale" });
  chartofaccount.cashaccount = await financeaccount.findOne({ name: "cash" });
  chartofaccount.cgsaccount = await financeaccount.findOne({ name: "cost of goods sold" });
  chartofaccount.inventoryaccount = await financeaccount.findOne({ name: "inventory" });
  global.chartofaccount = chartofaccount;
}
app.get("/", (req, res, next) => {
  res.status(201).json({
    status: "success"
  });
})
// #endregion variables 

app.use('/api/user', userRouter);
app.use('/api/accounting', accountingRouter);
app.use('/api/product', productRouter);
app.use('/api/category', categoryRouter);
module.exports = app;