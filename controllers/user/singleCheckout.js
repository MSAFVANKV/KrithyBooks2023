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
        // const product = await productCollection.findOne(productId)
        const product = await productCollection.findOne({ _id: new mongoose.Types.ObjectId(productId) });
        req.session.productId = productId

        
        // console.log(productId)

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


exports.offer=async(req,res)=>{
    try{
        const id=req.params.id;
        console.log(req.session.productId)
        
        // const userCart= await cartCollection.findOne({
        //   customer:req.session.userID
        // });
        // const cartPrice= userCart.totalPrice;

        const product= await productCollection.findOne(
            { _id: new mongoose.Types.ObjectId( req.session.productId )});
        const productPrice= product.initialPrice;

  
        const offer=await couponCollection.findById(id);
        if(offer){
               discountPercentage = offer.discount;
                discountPrice = (discountPercentage / 100) * productPrice;
                discountPrice = Math.floor(discountPrice)
                finalPrice = productPrice - discountPrice;
  console.log(discountPercentage)

  
          res.json({
            data: {
              discountPrice,
              discountPercentage,
              finalPrice,
            },
          });
  
        }else{
  
          res.json({
            data: {
              discountPrice: 0,
              discountPercentage: 0,
              finalPrice: product.initialPrice,
            },
          });
  
        }
  
    }catch(error){
        console.log("eeror on chekcing offer :"+error)
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


exports.applySingleProductCoupon = async(req, res) => {
    try {
        const couponCode = req.body.couponCode;
        const productPrice = parseFloat(req.body.productPrice);

        const coupon = await couponCollection.findOne({ code: couponCode });

        if(!coupon) {
            return res.json({
                data: {
                    couponCheck: 'Invalid Coupon',
                    discountPrice: 0,
                    finalPrice: productPrice
                }
            });
        }

        const discount = productPrice * (coupon.discount / 100);
        const finalPrice = productPrice - discount;

        return res.json({
            data: {
                couponCheck: 'Coupon Applied Successfully',
                discountPrice: discount.toFixed(2),
                finalPrice: finalPrice.toFixed(2)
            }
        });

    } catch (error) {
        console.log('Error in applySingleProductCoupon: ' + error);
        return res.redirect('/');
    }
}


