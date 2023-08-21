const moment = require("moment");
const orderCollection = require("../../models/order");
const productCollection= require("../../models/admin/products");
const couponCollection = require("../../models/admin/coupons");


exports.viewPage = async (req, res) => {
    try {
        allOrders = await orderCollection
            .find({ customer: req.session.userID })
            .sort({ _id: -1 })
            .populate("customer")
            .populate("couponUsed")
        res.render("user/profile/partials/orders", {
            documentTitle: "My Orders | SHOE ZONE",
            allOrders,
            moment,
            currentUrl: req.originalUrl,
            session:req.session.userID,
        });
    } catch (error) {
        res.redirect('/');
        console.log("error on rendering order page")
    }
}