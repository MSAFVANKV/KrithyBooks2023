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
            documentTitle: "My Orders || KRITHY BOOKS",
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

exports.details=async(req,res)=>{
    try{
        const currentOrder = await orderCollection
      .findById(req.params.id)
      .populate("summary.product")
      .populate("couponUsed")
      .sort("");
      console.log("Coupon Used:", currentOrder.couponUsed);
      console.log("summary.product:", currentOrder.summary.product);
      // console.log("currentOrder", currentOrder);


    if (currentOrder) {
      res.render("user/profile/partials/orderDetails", {
        documentTitle: "Order Details | Krithy",
        currentOrder,
        moment,
        currentUrl: req.originalUrl,
        session:req.session.userID,
      });
    } else {
      res.redirect("/pageNotFound");
    }

    }catch(error){
        console.log("error on getting order detail page :"+error)
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
  
  exports.return=async(req,res)=>{
    try{
  
      const currentOrder = await orderCollection
        .findById(req.params.id)
  
        const deliverdDate=new Date(currentOrder.deliveredOn);
        console.log(deliverdDate.getTime());
        
        const currentDate=new Date();
        if(currentDate-deliverdDate < 7*24*60*60*1000){
          await orderCollection.findByIdAndUpdate(req.params.id, {
            $set: {
              status: 'return-requested',
            }
          })
          
          
          res.json({
            success: 'return'
          })
        }else{
          res.json({
            success: 'expired'
          })
        }
        
      
  
  
    }catch(error){
      console.log("error on return order :"+error)
    }
  }
  
  