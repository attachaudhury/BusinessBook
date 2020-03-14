var express = require("express");
var router = express.Router();
var product = require("../Models/product");
var financetransaction = require("../Models/financetransaction");
var checkAuth = require("../middleware/check-auth");


router.post("/possalenew", checkAuth, async (req, res, next) => {
  try {
    console.log('accounting/possalenew');
    var chartofaccount = global.chartofaccount;
    var soldproducts = req.body.list;
    var newsoldproductslist = [];
    
    var allsoldproductpurchasetotal = 0;
    var allsoldproductstotal = 0;



    for (let index = 0; index < soldproducts.length; index++) {
      const soldelement = soldproducts[index];
      const dbelement = await product.findById(soldproducts[index]._id);

      allsoldproductstotal += (soldelement.price-soldelement.discount)*soldelement.quantity;
      allsoldproductpurchasetotal += ((dbelement.purchaseprice+dbelement.carrycost) * soldelement.quantity);
      
      var newquatity  = dbelement.quantity - soldelement.quantity;
      await product.findByIdAndUpdate(soldelement._id,{quantity:newquatity})

      var newsoldproduct = {_id:soldelement._id,name:dbelement.name,price:soldelement.price - soldelement.discount,quantity:soldelement.quantity,total:(soldelement.price -soldelement.discount)*soldelement.quantity}

      newsoldproductslist.push(newsoldproduct);
    }


    var possaletransaction = await financetransaction.create({ amount: -allsoldproductstotal, description: 'sale', financeaccount: chartofaccount.possaleaccount._id, products: newsoldproductslist, status: 'posted', user: req.userid });

    await financetransaction.findByIdAndUpdate(possaletransaction._id, { group: possaletransaction._id });

    var cashtransaction = await financetransaction.create({ amount: allsoldproductstotal, description: 'cash against sale ' + possaletransaction._id, financeaccount: chartofaccount.cashaccount._id, group: possaletransaction._id, status: 'posted', user: req.userid });


    var cgstransaction = await financetransaction.create({ amount: allsoldproductpurchasetotal, description: 'cgs against sale ' + possaletransaction._id, financeaccount: chartofaccount.cgsaccount._id, group: possaletransaction._id, status: 'posted', user: req.userid });

    var inventorytransaction = await financetransaction.create({ amount: -allsoldproductpurchasetotal, description: 'inventory against sale ' + possaletransaction._id, financeaccount: chartofaccount.inventoryaccount._id, group: possaletransaction._id, status: 'posted', user: req.userid });

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
  console.log('/possaleget');
  var chartofaccount = global.chartofaccount;
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
  console.log('accounting/purchasenew');
  try {
    var chartofaccount = global.chartofaccount;
    var purchasedproducts = req.body.list;
    var purchasedproductstotal = purchasedproducts.reduce(function (total, currentelement) {
      return total + currentelement.total;
    }, 0);

    for (let index = 0; index < purchasedproducts.length; index++) {
      const element = purchasedproducts[index];
      var loadedProduct = await product.findById(element._id);
      var newquatity  = loadedProduct.quantity +element.quantity;
      await product.findByIdAndUpdate(element._id,{quantity:newquatity})
    }


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
  var chartofaccount = global.chartofaccount;
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
})
router.get("/dashboarddataget", async (req, res, next) => {
  console.log('/dashboarddataget')
  try {
    var chartofaccount = global.chartofaccount;
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



    var sevendaysbackdate = new Date(new Date((new Date()).setDate((new Date().getDate()) - 7)).setHours(5, 0,0));
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
    var chartofaccountbalancepastsevendays = {}
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
router.post("/productsalesreportget", async (req, res, next) => {
  console.log('productid')
  console.log(req.body.product);
  try {
    var chartofaccount = global.chartofaccount;
    console.log('chartofaccount.possaleaccount._id')
    console.log(chartofaccount.possaleaccount._id)
    var result = await financetransaction.aggregate([
      {$unwind: "$products"},
      {$match:{"products._id":req.body.product,financeaccount:chartofaccount.possaleaccount._id,description:"sale"}},
      {$project:{_id:0,sale_id:"$_id",createddate:1,product:"$products"}},
      ])
      res.status(201).json({
        status: "success",
        data: result
      })
  } 
  catch (ex) {
    res.status(201).json({
      status: "failed",
      message: ex.message
    })
  }
})

module.exports = router;
