var express = require("express");
var router = express.Router();
var user = require("../Models/user");
var product = require("../Models/product");
var category = require("../Models/product");
var financeaccount = require("../Models/financeaccount");
var financetransaction = require("../Models/financetransaction");
var checkAuth = require("../middleware/check-auth");
var multiparty = require("multiparty");
var fs = require("fs");
var fse = require("fs-extra");


router.post("/signin", (req, res, next) => {
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
  router.post("/updateprofile", checkAuth, async (req, res, next) => {
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
          ex: err.message,
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
  router.post("/updateprofileimage", checkAuth, async (req, res, next) => {
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
              message: "Not Saved.",
              ex: err.message
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
  router.post("/add", checkAuth, async (req, res, next) => {
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
  router.post("/delete", checkAuth, async (req, res, next) => {
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
        } else {
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
  router.post("/getonebyid", async (req, res, next) => {
    try {
      if (!req.body._id) {
        res.status(201).json({
          status: "failed",
          message: 'Id empty',
        });
      }
  
      var result = await user.findOne({ _id: req.body._id });
      if (result) {
        res.status(201).json({
          status: "success",
          data: result,
  
        })
      }
      else {
        res.status(201).json({
          status: "failed",
          message: 'User not found!'
        })
      }
    } catch (ex) {
      res.status(201).json({
        status: "failed",
        message: 'User not found!',
        ex: ex.message
      });
    }
  
  })
  router.post("/update", checkAuth, async (req, res, next) => {
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
      var result = await user.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true });
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
  router.get("/getrolewise", checkAuth, async (req, res, next) => {
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
  router.get("/getdepartments", async (req, res, next) => {
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

module.exports = router;
