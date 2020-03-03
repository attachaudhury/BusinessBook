var express = require("express");
var router = express.Router();
var user = require("../Models/user");
var product = require("../Models/product");
var category = require("../Models/product");
var financeaccount = require("../Models/financeaccount");
var financetransaction = require("../Models/financetransaction");
var checkAuth = require("../middleware/check-auth");

router.get("/", async (req, res, next) => {
  console.log('')
  try {
    var result = await product.find({});
    res.status(201).json({
      status: "success",
      data: result
    })
  } catch (Exception) {
    res.status(201).json({
      status: "failed",
      message: 'can not get result',
      ex: Exception.message,
    })
  }
  var result = await product.find({});

})
router.post("/getonebyid", async (req, res, next) => {
  try {
    if (!req.body._id) {
      res.status(201).json({
        status: "failed",
        message: 'Id empty',
      });
    }

    var result = await product.findOne({ _id: req.body._id });
    if (result) {
      res.status(201).json({
        status: "success",
        data: result,

      })
    }
    else {
      res.status(201).json({
        status: "failed",
        message: 'Item not found!'
      })
    }
  } catch (ex) {
    res.status(201).json({
      status: "failed",
      message: 'item not found!',
      ex: ex.message
    });
  }

})
router.post("/add", async (req, res, next) => {
  try {
    if (!req.body.name) {
      res.status(201).json({
        status: "failed",
        message: 'Name empty',
      });
    }
    var obj = new product({
      ...req.body
    });
    var result = await obj.save();
    if (result) {
      res.status(201).json({
        status: "success",
        data: result,
      })
    }
    else {
      res.status(201).json({
        status: "failed",
        message: 'Item not saved!'
      })
    }
  } catch (ex) {
    res.status(201).json({
      status: "failed",
      message: 'item not saved!!',
      ex: ex.message
    });
  }

})
router.post("/delete", async (req, res, next) => {
  console.log('product/delete request', req.body)
  try {
    if (!req.body._id) {
      res.status(201).json({
        status: "failed",
        message: 'Insufficient Data',
      });
    }

    var result = await product.findOne({ _id: req.body._id });
    if (result) {
      var result = await product.remove({ _id: req.body._id });
      res.status(201).json({
        status: "success",
        data: result,
      })
    }
    else {
      res.status(201).json({
        status: "failed",
        message: 'Item not saved!'
      })
    }
  } catch (ex) {
    console.log(ex)
    res.status(201).json({
      status: "failed",
      message: 'Please Try Later!',
      ex: ex.message
    });
  }

})
router.post("/edit", async (req, res, next) => {
  console.log('product edit request');
  console.log(req.body);
  try {
    if (!req.body.name) {
      res.status(201).json({
        status: "failed",
        message: 'Name empty',
      });
    }
    if (!req.body._id) {
      res.status(201).json({
        status: "failed",
        message: 'Id empty',
      });
    }

    var result = await product.findByIdAndUpdate(req.body._id, { ...req.body }, { new: true });
    if (result) {
      res.status(201).json({
        status: "success",
        data: result,
      })
    }
    else {
      res.status(201).json({
        status: "failed",
        message: 'Item not saved!'
      })
    }
  } catch (ex) {
    res.status(201).json({
      status: "failed",
      message: 'item not saved!!',
      ex: ex.message
    });
  }

})

module.exports = router;
