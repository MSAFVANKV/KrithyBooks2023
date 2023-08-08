const cartCollection = require('../../models/cart');
const productCollection = require('../../models/admin/products')
const wishlistCollection = require('../../models/wishlist');
const { default: mongoose } = require("mongoose");

exports.viewCart = async (req, res) => {
    try {
      const userCart = await cartCollection.findOne({ customer: req.session.userID }).populate({ path: "products.name", populate: { path: "author" } });
      res.render("user/profile/partials/cart", {
        userCart,
        session:req.session.userID,
      });
    } catch (error) {
      console.log("error rendering cart page:" + error)
    }
  }

  exports.addToCart = async (req, res) => {
    try {
  
      const wishlistCheck = await wishlistCollection.findOne({
        customer: req.session.userID,
        products: new mongoose.Types.ObjectId(req.body.id)
      });
  
      if (wishlistCheck) {
        await wishlistCollection.findByIdAndUpdate(wishlistCheck._id,
          { $pull: { products: req.body.id } });
      }
      const product = await productCollection.findOne({ _id: req.body.id });
      const userCart = await cartCollection.findOne({ customer: req.session.userID });
      const prodExist = await cartCollection.findOne({
        _id: userCart._id,
        products: { $elemMatch: { name: new mongoose.Types.ObjectId(req.body.id) } }
      });
      if(product.stock===0){
        res.json({
          success: "outofstcok",
          message: 0,
        });
      }
     else if (prodExist) {
        await cartCollection.updateOne({
          _id: userCart._id,
          products: { $elemMatch: { name: req.body.id } }
        }, {
          $inc: {
            "products.$.quantity": 1,
            totalPrice: product.price,
            totalQuantity: 1,
            "products.$.price": product.price,
          }
        });
        res.json({
          success: "countAdded",
          message: 1,
        });
  
      }
      else {
        await cartCollection.findByIdAndUpdate(userCart._id,
          {
            $push: { products: { name: req.body.id, price: product.price } },
            $inc: { totalQuantity: 1, totalPrice: product.price }
          })
        res.json({
          success: "addedToCart",
          message: 1
        });
  
      }
  
  
    } catch (error) {
      console.log("error on addin to cart:" + error)
    }
  }
  