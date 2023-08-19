const { default: mongoose } = require("mongoose");
const cartCollection=require("../../models/cart");
const userCollection=require("../../models/user");
const couponCollection=require("../../models/admin/coupons");
const productCollection = require('../../models/admin/products')


exports.directCheckout = async(req, res) => {
    try {
        // console.log("stock",req.query.stock);
        // console.log("productId",req.query.id);
        const stock = req.query.stock;
        const productId = req.query.id;

        // Ensure the product exists
        const product = await productCollection.findOne({ productId });

        if (!product) {
            console.log('Error in directCheckout: Product not found.');
            return res.redirect('/');
        }
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
        // Render the checkout page directly with the product details
        res.render("user/profile/partials/buyNow", {
            productDetails: product,
            session: req.session.userID,
            documentTitle: "Krithy Books - Direct Checkout",
            defaultAddress,
            coupons,
            allAddresses,
            currentUrl: req.originalUrl
        });

    } catch (error) {
        console.log('Error in directCheckout: ' + error);
        res.redirect('/');
    }
}

exports.defaultAddress=async(req,res)=>{
    try{
console.log("ffffsjj")
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

        res.redirect("/users/directCheckout");

    }catch(error){
        
        res.redirect("/users/directCheckout");
        console.log("error on changing to deafultaddress :"+error)

    }
}


// exports.singleCheckout = async(req, res) => {
//     try {
//         // console.log("stock",req.query.stock);
//         // console.log("productId",req.query.id);
    
//         const product = await productCollection.findOne({ _id: req.body.id });

//         if (!product) {
//             console.log('Error in directCheckout: Product not found singleCheckout.');
//             return res.redirect('/');
//         }
//         let allAddresses=await userCollection.findById(req.session.userID);
//         allAddresses=allAddresses.addresses;
//         let defaultAddress=await userCollection.aggregate([
//             {$match:{_id:new mongoose.Types.ObjectId(req.session.userID)}},
//             {$unwind:"$addresses"},
//             {$match:{"addresses.primary":true}}
//         ]);
//         let coupons= await couponCollection.find()
//         if (defaultAddress != ""){
//             defaultAddress = defaultAddress[0].addresses;
//           } else {
//             defaultAddress = 0;
//           }
//         // Render the checkout page directly with the product details
//         res.render("user/profile/partials/buyNow", {
//             productDetails: product,
//             session: req.session.userID,
//             documentTitle: "Krithy Books - Direct Checkout",
//             defaultAddress,
//             coupons,
//             allAddresses
//         });

//     } catch (error) {
//         console.log('Error in directCheckout: ' + error);
//         res.redirect('/');
//     }
// }
