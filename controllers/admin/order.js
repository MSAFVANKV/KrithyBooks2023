const adminuser =  require('../../models/admin/user')
const orderCollection = require('../../models/order');
const couponCollection = require('../../models/admin/coupons');
const productCollection = require('../../models/admin/products');
const moment = require('moment')

// exports.orderviewPage = async (req, res) => {
//     try {
//         let currentAdmin
//          currentAdmin = adminuser.findOne(req.session.admin)
//         res.render("admin/partial/orders", {sessionadmin: req.session.admin})
//     } catch (error) {
//         console.log("Error rendering admin signin Page: " + error);
//     }
// }
exports.orderviewPage = async (req, res) => {
    try {

        const allOrders = await orderCollection
            .find()
            .populate("customer", "name email")
            .populate("couponUsed", "name")
            .populate("summary.product", "category name brand price")
            .populate("summary.product.category")
            .sort({ _id: -1 });
        res.render(
            "admin/partial/orders", {
            allOrders,
            documentTitle: "Orders | SHOE ZONE ",
            moment,
            session: req.session.admin
        }
        )
    } catch (error) {
        res.redirect("/admin/dashboard")
        console.log("error on rendering order page :" + error)
    }
}

exports.detailsPage = async (req, res) => {
    try {
        const orderID = req.params.id;
        const currentOrder = await orderCollection
            .findById(orderID)
            .populate("summary.product")
            .populate("couponUsed", "name")
            .populate("discountPrice")

        res.render("admin/partial/orderDetails", {
            session: req.session.admin,
            currentOrder,
            moment,
            documentTitle: "Order Details | Krithy Books",
        });

    } catch (error) {
        res.redirect("/admin/dashboard")
        console.log("error on rendering product detail page")
    }
}

exports.cancel = async (req, res) => {
    const currentOrder = await orderCollection
        .findById(req.params.id)
      await orderCollection.findByIdAndUpdate(req.params.id, {
        $set: {
          status: 'Cancelled',
          deliveredOn: null
        }
      })
      await couponCollection.findByIdAndUpdate(currentOrder.couponUsed,{
        $inc :{qty:1}
      })
     currentOrder.summary.forEach(async(ele) => {
        console.log("here")
        await productCollection.updateOne({_id:ele.product},{$inc:{stock:ele.quantity}})
      });
      res.json({
        success: 'cancelled'
      })
    }

exports.deliver = async (req, res) => {
    try {
        await orderCollection.findByIdAndUpdate(req.body.orderID, {
            $set: {
                delivered: true,
                deliveredOn: new Date(),
                status: "delivered"
            }
        });
        res.json({
            data: { delivered: 1 },
        });

    } catch (error) {
        res.redirect("/admin/dashboard")
        coonsole.log("erro on delivering product :" + error)
    }
}
exports.return = async (req, res) => {
    try {
        await orderCollection.findByIdAndUpdate(req.body.orderID, {
            $set: {

                returnedOn: new Date(),
                status: "returned",
                delivered: false
            }
        });
        const currentOrder = await orderCollection
            .findById(req.body.orderID)

        currentOrder.summary.forEach(async (ele) => {
            await productCollection.updateOne({ _id: ele.product }, { $inc: { stock: ele.quantity } })

        });
        res.json({
            data: { returned: 1 },
        });

    } catch (error) {
        res.redirect("/admin/dashboard")
        coonsole.log("erro on returning product :" + error)
    }
}


