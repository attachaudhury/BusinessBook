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
var chartofaccount={
  cashaccount:null,
  inventoryaccount:null,
  possaleccount:null,
  csgaccount:null,
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
  product.create({name:'milkpack',purchaseprice:30,saleprice:40})
  product.create({name:'pepsi',purchaseprice:20,saleprice:25})
  product.create({name:'pampers',purchaseprice:700,saleprice:800})

  var elec = new category({name: "Electronics"});
  await elec.save();
  
  var mob = new category({name: "Mobiles"});
  mob.parentId = elec._id;
  await mob.save();

  var tv = new category({name: "Tv"});
  tv.parentId = elec._id;
  await tv.save();
  
  var cl = new category({name: "Clothes"});
  await cl.save();
  

  // assets account
  chartofaccount.possaleccount = await financeaccount.create({name:'pos sale',type:'income'});
  chartofaccount.cashaccount = await financeaccount.create({name:'cash',type:'asset'});
  chartofaccount.csgaccount = await financeaccount.create({name:'cost of goods sold',type:'expence'});
  chartofaccount.inventoryaccount = await financeaccount.create({name:'inventory',type:'asset'});
  
}

async function loadcharofaccount(){
  chartofaccount.possaleaccount = await financeaccount.findOne({name:"pos sale"});
  chartofaccount.cashaccount = await financeaccount.findOne({name:"cash"});
  chartofaccount.cgsaccount = await financeaccount.findOne({name:"cost of goods sold"});
  chartofaccount.inventoryaccount = await financeaccount.findOne({name:"inventory"});
}
app.get("/", (req, res, next) => {
  res.status(201).json({
    status: "success"
  });
})
// #endregion variables

// #region user api
app.post("/api/user/signin", (req, res, next) => {
  console.log('Signin request');
  console.log(req.body)
  user.findOne({
    username: req.body.username,
    password: req.body.password
  }).then(result => {
    if (!result) {
      res.status(201).json({
        status: "failed",
        message: 'User does not exists'
      })
    } else {
      res.status(201).json({
        status: "success",
        data: result
      })
    }
  })
})
app.post("/api/user/updateprofile", checkAuth, async (req, res, next) => {
  try {
    console.log('updateprofile request');
    var updateduser = { ...req.body };
    user.findOneAndUpdate({
      _id: req.userid
    }, updateduser, {
      new: true
    }).then(result => {
      if (result) {

        res.status(201).json({
          status: "success",
          data: result
        })
      } else {
        res.status(201).json({
          status: "failed",
          message: 'Not saved'
        })

      }
    }).catch(err => {
      res.status(201).json({
        status: "failed",
        message: 'Not saved.',
        ex:err.message,
      })
    })
  } catch (ex) {
    res.status(201).json({
      status: "failed",
      message: 'Not saved..',
      ex: ex
    })
  }
})
app.post("/api/user/updateprofileimage", checkAuth, async (req, res, next) => {
  try {
    var form = new multiparty.Form();
    form.parse(req, async function (err, fields, files) {
      var profileimage = files.files[0];
      var profileimagename = "/profileimage/" + Date.now() + ".png";
      fse.moveSync(profileimage.path, "public" + profileimagename, {
        overwrite: true
      })
      var radius = 75;
      var data = fs.readFileSync("public" + profileimagename);
      var png = PNG.sync.read(data);
      var options = { filterType: 4 };
      for (var y = 0; y < png.height; y++) {
        for (var x = 0; x < png.width; x++) {
          var idx = (png.width * y + x) << 2;
          if (Math.pow(x - radius, 2) + Math.pow(y - radius, 2) > Math.pow(radius, 2)) {
            png.data[idx + 3] = 0;
          }
        }
      }
      var buffer = PNG.sync.write(png, options);
      fs.writeFileSync("public" + profileimagename, buffer);
      user.findOneAndUpdate({
        _id: req.userid
      }, {
        "profileimage": profileimagename
      }, {
        new: true
      })
        .then(result => {
          res.status(201).json({
            status: "success",
            data: result
          });
        }).catch(err => {
          res.status(201).json({
            status: "failed",
            message:"Not Saved.",
            ex:err.message
          });
        })
    })
  } catch (ex) {
    res.status(201).json({
      status: "failed",
      message: 'Not saved....',
      ex: ex.message
    })
  }
})
app.post("/api/user/add", checkAuth, async (req, res, next) => {
  try {
    console.log('adduser request');
    console.log(req.body);
    var username = req.body.username || '';
    var password = req.body.password || '';
    var role = req.body.role || '';
    var department = req.body.department || null;

    if (username == '' || password == '' || role == '') {
      res.status(201).json({
        status: "failed",
        message: 'Email or password or role missing',
      })
      return;
    }
    if (role == 'user' && department == null) {
      res.status(201).json({
        status: "failed",
        message: 'department not specified for user',
      })
      return;
    }
    if (role == 'agency' && department != null) {
      res.status(201).json({
        status: "failed",
        message: 'department specified for department account',
      })
      return;
    }
    if (role == 'admin' && department != '') {
      res.status(201).json({
        status: "failed",
        message: 'department specified for admin account',
      })
      return;
    }
    // res.status(201).json({
    //   status: "success",
    //   data:req.body,
    //   message: 'ok',
    // })
    // return;
    var newuser = new user({
      address: req.body.address,
      department: department,
      companyname: req.body.companyname,
      companyimage: "/companyimage/defaultcompanyimage.png",
      createddate: Date.now(),
      city: req.body.city,
      country: req.body.country,
      designation: req.body.designation,
      dateofbirth: req.body.dateofbirth,
      email: req.body.email,
      firstname: req.body.firstname,
      activestatus: 'active',
      lastname: req.body.lastname,
      lastlogindate: null,
      personalphone: req.body.personalphone,
      password: password,
      profileimage: "/profileimage/defaultprofileimage.png",
      role: role,
      title: req.body.title,
      username: username,
      workphone: req.body.workphone,
      website: req.body.website,
    })
    var result = await newuser.save();
    if (result) {
      res.status(201).json({
        status: "success",
        data: result
      })
    } else {
      res.status(201).json({
        status: "failed",
        message: 'Not saved ....',
      })
    }
  } catch (ex) {
    res.status(201).json({
      status: "failed",
      message: 'Not saved ....',
      ex: ex.message
    })
  }
})
app.post("/api/user/delete", checkAuth, async (req, res, next) => {
  try {
    console.log('deleteuser request');
    console.log(req.body);
    var _id = req.body._id || '';
    if (_id == '') {
      res.status(201).json({
        status: "failed",
        message: 'User not mentioned',
      })
      return;
    }

    var usertodelete = await user.findOne({ _id: _id });
    // userprojects = await videoproject.find({userid:deletinguserid}); 
    // console.log('userprojects');
    // console.log(userprojects);
    // res.status(201).json({
    //   status: "test",
    //   data: req.body,
    //   message: 'ok',
    // })
    // return;
    if (usertodelete.role == 'user') {
      console.log('delete user account')
      usertodelete.remove().then(result => {
        if (result) {
          res.status(201).json({
            status: "success",
            message: 'User removed'
          })
        } else {
          res.status(201).json({
            status: "failed",
            message: 'User not removed'
          })
        }
      }).catch(err => {
        res.status(201).json({
          status: "failed",
          message: 'Not saved.'
        })
      })
    }
    else if (usertodelete.role == 'department') {
      console.log('delete department account')
      await user.remove({ department: _id })
      await usertodelete.remove()
      res.status(201).json({
        status: "success",
        message: 'department account removed'
      })
    }
    else if (usertodelete.role == 'admin') {
      console.log('delete this admin')
      if (usertodelete.username != 'admin') {
        usertodelete.remove().then(result => {
          if (result) {
            res.status(201).json({
              status: "success",
              message: 'Admin account removed'
            })
          } else {
            res.status(201).json({
              status: "failed",
              message: 'User not removed'
            })

          }
        }).catch(err => {
          res.status(201).json({
            status: "failed",
            message: 'Not saved.'
          })
        })
      }else{
        res.status(201).json({
          status: "failed",
          message: 'Admin cannot be removed'
        })
      }
    }
  } catch (ex) {
    res.status(201).json({
      status: "failed",
      message: 'Not saved ....',
      ex: ex.message
    })
  }
})
app.post("/api/user/getonebyid",async (req, res, next) => {
  try
  {
    if(!req.body._id){
      res.status(201).json({
        status: "failed",
        message:'Id empty',
      });
    }
    
    var result = await user.findOne({_id:req.body._id});
    if(result){
      res.status(201).json({
        status: "success",
        data:result,

      })
    }
    else
    {
      res.status(201).json({
        status: "failed",
        message:'User not found!'
      })
    }
  }catch(ex)
  {
    res.status(201).json({
      status: "failed",
      message:'User not found!',
      ex:ex.message
    });
  }
  
})
app.post("/api/user/update", checkAuth, async (req, res, next) => {
  try {
    console.log('update request');
    console.log(req.body);
    var username = req.body.username || '';
    var password = req.body.password || '';
    var role = req.body.role || '';
    var department = req.body.department || null;

    if (username == '' || password == '' || role == '') {
      res.status(201).json({
        status: "failed",
        message: 'Email or password or role missing',
      })
      return;
    }
    if (role == 'user' && department == null) {
      res.status(201).json({
        status: "failed",
        message: 'department not specified for user',
      })
      return;
    }
    if (role == 'department' && department != null) {
      res.status(201).json({
        status: "failed",
        message: 'department specified for department account',
      })
      return;
    }
    if (role == 'admin' && department != '') {
      res.status(201).json({
        status: "failed",
        message: 'department specified for admin account',
      })
      return;
    }
    var result = await user.findByIdAndUpdate(req.body._id,{...req.body},{new:true});
    if (result) {
      res.status(201).json({
        status: "success",
        data: result
      })
    } else {
      res.status(201).json({
        status: "failed",
        message: 'Not saved ....',
      })
    }
  } catch (ex) {
    res.status(201).json({
      status: "failed",
      message: 'Not saved ....',
      ex: ex.message
    })
  }
})
app.get("/api/user/getrolewise", checkAuth, async (req, res, next) => {
  console.log('getusersrolewise request');
  try {
    var loadeduser = await user.findOne({ _id: req.userid });
    if (loadeduser.role == 'department') {
      user.find({ department: req.userid }).then(result => {
        res.status(201).json({
          status: "success",
          data: result
        });
      }).catch(err => {
        res.status(201).json({
          status: "failed",
          message: 'Not saved',
          ex: err.message
        });
      })
    }
    else if (loadeduser.role == 'admin') {
      user.find({}).then(result => {
        res.status(201).json({
          status: "success",
          data: result
        });
      }).catch(err => {
        res.status(201).json({
          status: "failed",
          message: 'Not saved',
          ex: err.message
        });
      })
    }
    else {
      res.status(201).json({
        status: "success",
        data: []
      });
    }
  } catch (ex) {
    res.status(201).json({
      status: "failed",
      message: 'Not saved..',
      ex: ex.message,
    })
  }
})
app.get("/api/user/getdepartments", async (req, res, next) => {
  console.log('getdepartments request');
  try {
    user.find({ role: 'department' }).then(result => {
      res.status(201).json({
        status: "success",
        data: result
      });
    }).catch(err => {
      res.status(201).json({
        status: "failed"
      });
    })
  } catch (ex) {
    res.status(201).json({
      status: "failed",
      message: 'Not saved..',
      ex: ex.message,
    })
  }
})
// #endregion user api

//#region category
app.get("/api/category", async (req, res, next) => {
  var result = await category.GetFullArrayTree();
  res.status(201).json({
    status: "success",
    data:result
  })
})
app.post("/api/category/getonebyid",async (req, res, next) => {
  try
  {
    if(!req.body._id){
      res.status(201).json({
        status: "failed",
        message:'Id empty',
      });
    }
    
    var result = await category.findOne({_id:req.body._id});
    if(result){
      res.status(201).json({
        status: "success",
        data:result,

      })
    }
    else
    {
      res.status(201).json({
        status: "failed",
        message:'Item not found!'
      })
    }
  }catch(ex)
  {
    res.status(201).json({
      status: "failed",
      message:'item not found!',
      ex:ex.message
    });
  }
  
})
app.post("/api/category/add",async (req, res, next) => {
  try
  {
    if(!req.body.name){
      res.status(201).json({
        status: "failed",
        message:'Name empty',
      });
    }
    var obj = new category({
      name:req.body.name,
    });
    if(req.body.parentId)
    {
      obj.parentId =  req.body.parentId;
    }
    var result = await obj.save();
    if(result){
      res.status(201).json({
        status: "success",
        data:result,

      })
    }
    else
    {
      res.status(201).json({
        status: "failed",
        message:'Item not saved!'
      })
    }
  }catch(ex)
  {
    res.status(201).json({
      status: "failed",
      message:'item not saved!!',
      ex:ex.message
    });
  }
  
})
app.post("/api/category/delete",async (req, res, next) => {
  console.log('category/delete request', req.body)
  try
  {
    if(!req.body._id){
      res.status(201).json({
        status: "failed",
        message:'Insufficient Data',
      });
    }

    var result = await category.findOne({_id:req.body._id});
    if(result){
      var children = await result.getChildren();
      if(children.length>0)
      {
        res.status(201).json({
          status: "failed",
          message:'This item has chidren, delete chlidren first !'
        })  
      }
      else{
        var result = await category.remove({_id:req.body._id});
        res.status(201).json({
          status: "success",
          data:result,
        })
      }
      
    }
    else
    {
      res.status(201).json({
        status: "failed",
        message:'Item not saved!'
      })
    }
  }catch(ex)
  {
    console.log(ex)
    res.status(201).json({
      status: "failed",
      message:'Please Try Later!',
      ex:ex.message
    });
  }
  
})
app.post("/api/category/edit",async (req, res, next) => {
  console.log('category edit request');
  console.log(req.body);
  try
  {
    if(!req.body.name){
      res.status(201).json({
        status: "failed",
        message:'Name empty',
      });
    }
    if(!req.body._id){
      res.status(201).json({
        status: "failed",
        message:'Name empty',
      });
    }

    var result = await category.findByIdAndUpdate(req.body._id,{...req.body},{new:true});
    if(result){
      res.status(201).json({
        status: "success",
        data:result,
      })
    }
    else
    {
      res.status(201).json({
        status: "failed",
        message:'Item not saved!'
      })
    }
  }catch(ex)
  {
    res.status(201).json({
      status: "failed",
      message:'item not saved!!',
      ex:ex.message
    });
  }
  
})
//#endregion category

//#region product
app.get("/api/product", async (req, res, next) => {
  console.log('/api/product')
  try
  {
    var result = await product.find({});
    res.status(201).json({
      status: "success",
      data:result
    })
  }catch(Exception)
  {
    res.status(201).json({
      status: "failed",
      message:'can not get result',
      ex:Exception.message,
    })
  }
  var result = await product.find({});
  
})
app.post("/api/product/getonebyid",async (req, res, next) => {
  try
  {
    if(!req.body._id){
      res.status(201).json({
        status: "failed",
        message:'Id empty',
      });
    }
    
    var result = await product.findOne({_id:req.body._id});
    if(result){
      res.status(201).json({
        status: "success",
        data:result,

      })
    }
    else
    {
      res.status(201).json({
        status: "failed",
        message:'Item not found!'
      })
    }
  }catch(ex)
  {
    res.status(201).json({
      status: "failed",
      message:'item not found!',
      ex:ex.message
    });
  }
  
})
app.post("/api/product/add",async (req, res, next) => {
  try
  {
    if(!req.body.name){
      res.status(201).json({
        status: "failed",
        message:'Name empty',
      });
    }
    var obj = new product({
      ...req.body
    });
    var result = await obj.save();
    if(result){
      res.status(201).json({
        status: "success",
        data:result,
      })
    }
    else
    {
      res.status(201).json({
        status: "failed",
        message:'Item not saved!'
      })
    }
  }catch(ex)
  {
    res.status(201).json({
      status: "failed",
      message:'item not saved!!',
      ex:ex.message
    });
  }
  
})
app.post("/api/product/delete",async (req, res, next) => {
  console.log('product/delete request', req.body)
  try
  {
    if(!req.body._id){
      res.status(201).json({
        status: "failed",
        message:'Insufficient Data',
      });
    }

    var result = await product.findOne({_id:req.body._id});
    if(result){
      var result = await product.remove({_id:req.body._id});
        res.status(201).json({
          status: "success",
          data:result,
        })
    }
    else
    {
      res.status(201).json({
        status: "failed",
        message:'Item not saved!'
      })
    }
  }catch(ex)
  {
    console.log(ex)
    res.status(201).json({
      status: "failed",
      message:'Please Try Later!',
      ex:ex.message
    });
  }
  
})
app.post("/api/product/edit",async (req, res, next) => {
  console.log('product edit request');
  console.log(req.body);
  try
  {
    if(!req.body.name){
      res.status(201).json({
        status: "failed",
        message:'Name empty',
      });
    }
    if(!req.body._id){
      res.status(201).json({
        status: "failed",
        message:'Id empty',
      });
    }

    var result = await product.findByIdAndUpdate(req.body._id,{...req.body},{new:true});
    if(result){
      res.status(201).json({
        status: "success",
        data:result,
      })
    }
    else
    {
      res.status(201).json({
        status: "failed",
        message:'Item not saved!'
      })
    }
  }catch(ex)
  {
    res.status(201).json({
      status: "failed",
      message:'item not saved!!',
      ex:ex.message
    });
  }
  
})
//#endregion product

//#region accounting
app.post("/api/accounting/possalenew",checkAuth,async (req, res, next) => {
  try
  {
    console.log('accounting/possalenew');
    var soldproducts = req.body.list;
    var soldproducttotal = soldproducts.reduce(function(total,currentelement){
      return total+currentelement.total;
    },0);

    // var soldproductpurchasetotal = soldproducts.reduce(async function(total,currentelement){
    //   var loadedproduct = await product.findById(currentelement._id); 
    //   return total+(loadedproduct.purchaseprice*currentelement.quantity);
    // },0);
    var soldproductpurchasetotal = 0;
    for (let index = 0; index < soldproducts.length; index++) {
      const element = await product.findById(soldproducts[index]._id);
      soldproductpurchasetotal+= (element.purchaseprice*soldproducts[index].quantity)
    }

    var possaletransaction = await financetransaction.create({amount:-soldproducttotal,description:'sale',financeaccount:chartofaccount.possaleaccount._id,soldproducts:soldproducts,status:'posted',user:req.userid});

    await financetransaction.findByIdAndUpdate(possaletransaction,{group:possaletransaction._id});

    var cashtransaction = await financetransaction.create({amount:soldproducttotal,description:'cash against sale '+possaletransaction._id,financeaccount:chartofaccount.cashaccount._id,group:possaletransaction._id,status:'posted',user:req.userid});


    var cgstransaction = await financetransaction.create({amount:soldproductpurchasetotal,description:'cgs against sale '+possaletransaction._id,financeaccount:chartofaccount.cgsaccount._id,group:possaletransaction._id,status:'posted',user:req.userid});

    var inventorytransaction = await financetransaction.create({amount:-soldproductpurchasetotal,description:'inventory against sale '+possaletransaction._id,financeaccount:chartofaccount.inventoryaccount._id,group:possaletransaction._id,status:'posted',user:req.userid});

    res.status(201).json({
      status: "success",
      data:possaletransaction._id,
    })
  }catch(ex)
  {
    res.status(201).json({
      status: "failed",
      message:'item not found!',
      ex:ex.message
    });
  }
})

app.get("/api/accounting/possaleget", async (req, res, next) => {
  console.log('/api/accounting/possaleget')
  try
  {
    var result = await financetransaction.find({financeaccount:chartofaccount.possaleaccount._id}).sort({_id:-1});
    res.status(201).json({
      status: "success",
      data:result
    })
  }catch(Exception)
  {
    console.log(Exception)
    res.status(201).json({
      status: "failed",
      message:'can not get result',
      ex:Exception.message,
    })
  }
  var result = await product.find({});
  
})
//#endregion accounting




module.exports = app;