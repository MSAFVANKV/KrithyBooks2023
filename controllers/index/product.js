const userCollection = require('../../models/user')
const productCollection =require('../../models/admin/products')

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
        const productDetails=await productCollection.findById(req.params.id).populate("brand").populate("category");
        let productsInWishlist=null;
        let percentageOffer=null;
        if(productDetails.initialPrice){
          percentageOffer=Math.ceil((productDetails.initialPrice-productDetails.price)*100/productDetails.initialPrice);
        }
    const similarProducts= await  productCollection.find({}).sort({_id:1}).limit(10)
       
        res.render("index/productSowPage", {
            documentTitle: productDetails.name,
            productDetails,
            session: req.session.userID,
            currentUser,
            productsInWishlist,
            reviews,
            numberOfReviews,
            moment,
            listing:similarProducts,
            percentageOffer,
            userCart

          });


    }catch(error){
        res.redirect("/")
        console.log("error rendering product page:"+error)
    }
}