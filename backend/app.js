// #region variables 
var express = require('express');
var path = require('path');
var fs = require('fs');
var fse = require('fs-extra');
var bodyParser = require('body-parser');
var mongoose = require("mongoose")
var user = require('./Models/user')
var category = require('./Models/category')
var product = require('./Models/product')
var financeaccount = require('./Models/financeaccount')
var financetransaction = require('./Models/financetransaction')
var checkAuth = require("./middleware/check-auth");
var userRouter = require('./routes/user');
var accountingRouter = require('./routes/accounting');
var productRouter = require('./routes/product');
var categoryRouter = require('./routes/category');
var app = express();
var multiparty = require('multiparty');
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
global.chartofaccount = {
  cashaccount: null,
  inventoryaccount: null,
  possaleaccount: null,
  csgaccount: null,
};
//dbsetting();
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
  product.create({ name: 'milkpack', purchaseprice: 30, saleprice: 40 })
  product.create({ name: 'pepsi', purchaseprice: 20, saleprice: 25 })
  product.create({ name: 'pampers', purchaseprice: 700, saleprice: 800 })

  var elec = new category({ name: "Electronics" });
  await elec.save();

  var mob = new category({ name: "Mobiles" });
  mob.parentId = elec._id;
  await mob.save();

  var tv = new category({ name: "Tv" });
  tv.parentId = elec._id;
  await tv.save();

  var cl = new category({ name: "Clothes" });
  await cl.save();


  // assets account
  global.chartofaccount.possaleccount = await financeaccount.create({ name: 'pos sale', type: 'income' });
  global.chartofaccount.cashaccount = await financeaccount.create({ name: 'cash', type: 'asset' });
  global.chartofaccount.csgaccount = await financeaccount.create({ name: 'cost of goods sold', type: 'expence' });
  global.chartofaccount.inventoryaccount = await financeaccount.create({ name: 'inventory', type: 'asset' });

}
loadcharofaccount()
async function loadcharofaccount() {
  global.chartofaccount.possaleaccount = await financeaccount.findOne({ name: "pos sale" });
  global.chartofaccount.cashaccount = await financeaccount.findOne({ name: "cash" });
  global.chartofaccount.cgsaccount = await financeaccount.findOne({ name: "cost of goods sold" });
  global.chartofaccount.inventoryaccount = await financeaccount.findOne({ name: "inventory" });
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