const { default: mongoose } = require("mongoose");
const cartCollection=require("../../models/cart");
const userCollection=require("../../models/user");
const couponCollection=require("../../models/admin/coupons");
const productCollection = require('../../models/admin/products')


exports.viewPage=async(req,res)=>{
    try{
        userID = req.session.userID
      let currentUser = await userCollection.findById(userID)

        const userCart=await cartCollection.findOne({customer:req.session.userID}).populate("products.name");
        let products=userCart.products;

     if(userCart.totalQuantity != 0){
        let allAddresses=await userCollection.findById(req.session.userID);
        allAddresses=allAddresses.addresses;
        let defaultAddress=await userCollection.aggregate([
            {$match:{_id:new mongoose.Types.ObjectId(req.session.userID)}},
            {$unwind:"$addresses"},
            {$match:{"addresses.primary":true}}
        ]);
        let coupons= await couponCollection.find()
        if (defaultAddress != ""){
            defaultAddress = defaultAddress[0].addresses;
          } else {
            defaultAddress = 0;
          }
        res.render("user/profile/partials/checkout", {
            defaultAddress,
            products,
            userCart,
            allAddresses,
            coupons,
            documentTitle: "Krithy Books ",
            session:req.session.userID
          });}else {
            res.redirect("/users/cart");
          }

    }catch(error){
        res.redirect("/users/cart");
         console.log('error on rendering checkoutpage :'+error)
    }
}


exports.defaultAddress=async(req,res)=>{
    try{

        const userID = req.session.userID;
    const DefaultAddress = req.body.DefaultAddress;
    await userCollection.updateMany(
      { _id: userID, "addresses.primary": true },
      { $set: { "addresses.$.primary": false } }
    );
    await userCollection.updateOne(
      { _id: userID, "addresses._id": DefaultAddress },
      { $set: { "addresses.$.primary": true } }
    );
        res.redirect("/users/cart/checkout");

    }catch(error){
        res.redirect("/users/cart/checkout");
        console.log("error on changing to deafultaddress :"+error)

    }
}
