const userCollection = require('../../models/user')
const productCollection =require('../../models/admin/products')
const wishlistCollection = require('../../models/wishlist');
const cartCollection = require('../../models/cart');
const reviewCollection = require("../../models/user/reviews");
const orderCollection = require("../../models/order");
const mongoose = require('mongoose');


const moment = require("moment")

// exports.productView = async (req, res) => {
//     try {
//         let currentUser
//        currentUser=await userDTLS.findById(req.session.userID)
//         res.render('index/productShowPage', { message: "" , session:req.session.userID});
//     } catch (error) {
//         console.log("Error Occured"+error);
//     }
// }

exports.view=async(req,res)=>{
    try{
        const currentUser= await  userCollection.findById(req.session.userID);
        // const userCart= await cartCollection.findOne({customer:req.session.userID})
        const productDetails=await productCollection.findById(req.params.id).populate("author").populate("category");
        let productsInWishlist=null;
        let percentageOffer=null;
        let userCart;

        userCart= await cartCollection.findOne({customer:req.session.userID})

        if(productDetails.initialPrice){
          percentageOffer=Math.ceil((productDetails.initialPrice-productDetails.price)*100/productDetails.initialPrice);
        }
        if(currentUser){
            productsInWishlist= await wishlistCollection.findOne({
                customer:currentUser._id,
                products:req.params.id
            });
        }
    // const similarProducts= await  productCollection.find({}).sort({_id:1}).limit(10)

    const similarProducts = await productCollection.find({ 
        $or: [
           { category: productDetails.category._id },
           { author: productDetails.author._id }
        ],
        _id: { $ne: req.params.id } 
     }).limit(10);

    //  
    let reviews = await reviewCollection.find({ product: productDetails._id })
                .sort({
                createdAt: -1,
                })
                .populate({
                path: "customer",
                select: "username photo",
                });
               

   let allOrders = await orderCollection
   .find({ customer: req.session.userID })
//  console.log(allOrders)
    
let hasOrderedProduct = false;
let orderWasCancelled = false;

for (const order of allOrders) {
    for (const product of order.summary) {
        if (product.product.toString() === req.params.id) {
            hasOrderedProduct = true;
            if (order.status === 'Cancelled') {
                orderWasCancelled = true;
            }
            break; // Exit the inner loop once a match is found
        }
    }

    if (hasOrderedProduct) {
        break; // Exit the outer loop once a match is found
    }
}


   
        res.render("index/productShowPage", {
            documentTitle: productDetails.name,
            productDetails,
            session: req.session.userID,
            currentUser,
            listing:similarProducts,
            percentageOffer,
            productsInWishlist,
            moment,
            userCart,
            similarProducts,
            allOrders,
            hasOrderedProduct,
            productID: req.params.id,
            reviews,
            orderWasCancelled

          });


    }catch(error){
        res.redirect("/")
        console.log("error rendering product page:"+error)
    }
}

