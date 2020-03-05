var express = require("express");
var router = express.Router();
var user = require("../Models/user");
var product = require("../Models/product");
var category = require("../Models/product");
var financeaccount = require("../Models/financeaccount");
var financetransaction = require("../Models/financetransaction");
var checkAuth = require("../middleware/check-auth");
var chartofaccount = global.chartofaccount;

router.post("/possalenew", checkAuth, async (req, res, next) => {
    try {
      console.log('accounting/possalenew');
      var soldproducts = req.body.list;
      var soldproducttotal = soldproducts.reduce(function (total, currentelement) {
        return total + currentelement.total;
      }, 0);
  
      console.log(soldproducts)
      var soldproductpurchasetotal = 0;
      for (let index = 0; index < soldproducts.length; index++) {
        const element = await product.findById(soldproducts[index]._id);
        soldproductpurchasetotal += (element.purchaseprice * soldproducts[index].quantity)
      }
  
      var possaletransaction = await financetransaction.create({ amount: -soldproducttotal, description: 'sale', financeaccount: chartofaccount.possaleaccount._id, products: soldproducts, status: 'posted', user: req.userid });
  
      await financetransaction.findByIdAndUpdate(possaletransaction._id, { group: possaletransaction._id });
  
      var cashtransaction = await financetransaction.create({ amount: soldproducttotal, description: 'cash against sale ' + possaletransaction._id, financeaccount: chartofaccount.cashaccount._id, group: possaletransaction._id, status: 'posted', user: req.userid });
  
  
      var cgstransaction = await financetransaction.create({ amount: soldproductpurchasetotal, description: 'cgs against sale ' + possaletransaction._id, financeaccount: chartofaccount.cgsaccount._id, group: possaletransaction._id, status: 'posted', user: req.userid });
  
      var inventorytransaction = await financetransaction.create({ amount: -soldproductpurchasetotal, description: 'inventory against sale ' + possaletransaction._id, financeaccount: chartofaccount.inventoryaccount._id, group: possaletransaction._id, status: 'posted', user: req.userid });
  
      res.status(201).json({
        status: "success",
        data: possaletransaction._id,
      })
    } catch (ex) {
      console.log(ex)
      res.status(201).json({
        status: "failed",
        message: 'item not found!',
        ex: ex.message
      });
    }
  })
  
  router.get("/possaleget", async (req, res, next) => {
    console.log('/possaleget')
    try {
      var result = await financetransaction.find({ financeaccount: chartofaccount.possaleaccount._id }).sort({ _id: -1 });
      res.status(201).json({
        status: "success",
        data: result
      })
    } catch (Exception) {
      console.log(Exception)
      res.status(201).json({
        status: "failed",
        message: 'can not get result',
        ex: Exception.message,
      })
    }
    var result = await product.find({});
  
  })
  router.post("/purchasenew", checkAuth, async (req, res, next) => {
    try {
      console.log('accounting/purchasenew');
      var purchasedproducts = req.body.list;
      var purchasedproductstotal = purchasedproducts.reduce(function (total, currentelement) {
        return total + currentelement.total;
      }, 0);
  
  
      var inventorytransaction = await financetransaction.create({ amount: purchasedproductstotal, description: 'purchase', financeaccount: chartofaccount.inventoryaccount._id, products: purchasedproducts, status: 'posted', user: req.userid });
  
  
      await financetransaction.findByIdAndUpdate(inventorytransaction._id, { group: inventorytransaction._id });
  
      var cashtransaction = await financetransaction.create({ amount: -purchasedproductstotal, description: 'cash against purchase ' + inventorytransaction._id, financeaccount: chartofaccount.cashaccount._id, group: inventorytransaction._id, status: 'posted', user: req.userid });
  
  
      res.status(201).json({
        status: "success",
        data: inventorytransaction._id,
      })
    } catch (ex) {
      res.status(201).json({
        status: "failed",
        message: 'item not found!',
        ex: ex.message
      });
    }
  })
  router.get("/purchaseget", async (req, res, next) => {
    console.log('/purchaseget')
    try {
      var result = await financetransaction.find({ financeaccount: chartofaccount.inventoryaccount._id, amount: { $gt: 0 }, description: 'purchase' }).sort({ _id: -1 });
      res.status(201).json({
        status: "success",
        data: result
      })
    } catch (Exception) {
      console.log(Exception)
      res.status(201).json({
        status: "failed",
        message: 'can not get result',
        ex: Exception.message,
      })
    }
    var result = await product.find({});
  
  })
  router.get("/dashboarddataget", async (req, res, next) => {
    
    console.log('/dashboarddataget')
    try {
      var chartofaccountbalancetotalarray = (await financetransaction.aggregate(
        [
          { $group: { _id: "$financeaccount", amount: { $sum: "$amount" } } },
          {
            $lookup: {
              from: "financeaccount",
              localField: "_id",
              foreignField: "_id",
              as: "result"
            }
          },
          { $unwind: "$result" },
          { $project: { amount: 1, name: "$result.name" } }
        ]
      ));
      chartofaccountbalancetotal = {};
      chartofaccountbalancetotalarray.map(el => {
        chartofaccountbalancetotal[el.name] = el.amount
      });
  
      
      
      var sevendaysbackdate = new Date(new Date((new Date()).setDate((new Date().getDate()) - 6)).setHours(0, 0));
      var chartofaccountbalancepastsevendaysarrayraw = (await financetransaction.aggregate([
        { $match: { createddate: { $gte: sevendaysbackdate } } },
        { $group: { _id: { financeaccount: "$financeaccount", dayofyear: { $dayOfYear: "$createddate" } }, amount: { $sum: "$amount" }, date: { $max: "$createddate" } } },
        { $group: { _id: { financeaccount: "$_id.financeaccount" }, items: { $push: { date: "$date", amount: "$amount" } } } },
        { $lookup: { from: "financeaccount", localField: "_id.financeaccount", foreignField: "_id", as: "result" } }, { $unwind: "$result" },
        { $project: { _id: 0, financeaccount: "$_id.financeaccount", amount: 1, name: "$result.name", datewisebalance: "$items" } }
      ])
      )
      var chartofaccountbalancepastsevendaysarray = [];
      chartofaccountbalancepastsevendaysarrayraw.map(element => {
        var obj = {};
        obj.name = element.name;
        obj.financeaccount = element.financeaccount;
        obj.datewisebalance = []
        for (let index = 6; index >= 0; index--) {
          var startOfDate = new Date(new Date((new Date()).setDate((new Date().getDate()) - index)).setHours(0, 0));
          var endOfDate = new Date(new Date((new Date()).setDate((new Date().getDate()) - index)).setHours(23, 59));
          var objectexistsOnSpecificDate = element.datewisebalance.find(el => { return ((el.date >= startOfDate) && (el.date <= endOfDate)) })
          var amountobject = {};
          if (objectexistsOnSpecificDate) {
            amountobject.amount = objectexistsOnSpecificDate.amount;
            amountobject.date = startOfDate;
  
          }
          else {
            amountobject.amount = 0;
            amountobject.date = startOfDate;
  
          }
          obj.datewisebalance.push(amountobject);
        }
        chartofaccountbalancepastsevendaysarray.push(obj)
      });
      var chartofaccountbalancepastsevendays ={}
      chartofaccountbalancepastsevendaysarray.map(el => {
        chartofaccountbalancepastsevendays[el.name] = el.datewisebalance
      });
      console.log('sending result')
      res.status(201).json({
        status: "success",
        data: {
          chartofaccountbalancetotal: chartofaccountbalancetotal,
          chartofaccountbalancepastsevendays: chartofaccountbalancepastsevendays
        }
  
      })
    } catch (Exception) {
      console.log(Exception)
      res.status(201).json({
        status: "failed",
        message: 'can not get result',
        ex: Exception.message,
      })
    }
  })

module.exports = router;
