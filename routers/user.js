const express = require('express')
const router = express.Router();
const sessionCheck = require('../middlewares/users/sessioncheck')
const profile = require('../controllers/user/profile')
const croppedImgupload=require("../utilities/cropedImgUplod")
const address=require("../controllers/user/address");
const cartPage = require('../controllers/user/cart')
const wishlist = require('../controllers/user/whishlist')
const checkOut = require('../controllers/user/checkout');
const singleCheckOut = require('../controllers/user/singleCheckout')

const multer = require('multer');




// var upload = multer({
//     storage: multer.diskStorage({
//         destination: function (req, file, cb) {
//             cb(null, 'assets/img/users');
//         },
//         filename: function (req, file, cb) {
//             cb(null, `${req.session.userID}_${Date.now()}.jpeg`);
//         }
//     })
// });

var uploadCropped = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'assets/img/users');
        },
        filename: function (req, file, cb) {
            cb(null, `${req.session.userID}_cropped.jpeg`);
        }
    })
});



router
    .route('/profile')
    .get(sessionCheck, profile.viewPage)
    .post(sessionCheck, profile.updateUser);

router
    .route('/profile/uploadCroppedImage')
    .post( sessionCheck, uploadCropped.single('photo'), profile.uploadCroppedImage);


// Address Page
    router
    .route('/profile/manageAddress')
    .get(sessionCheck,profile.addressViewPage)
    .post(sessionCheck,profile.addAddress)
    .delete(sessionCheck,profile.deleteAddress)

    router
    .route('/profile/manageAddress/addressDelete')
    .delete(sessionCheck,profile.deleteAddress)

    router
    .route('/profile/manageAddress/editAddress')
    .put(sessionCheck,profile.editAddress)

    router.get("/profile/manageAddress/changeRole", sessionCheck, address.defaultToggler);

    // Cart ====
    router
    .route('/profile/cartItems')
    .get(sessionCheck,cartPage.viewCart)
    .post(sessionCheck,cartPage.addToCart)
    .delete(sessionCheck,cartPage.removeProduct)
  .put(sessionCheck,cartPage.countChange)


//   wishList
    router
    .route('/profile/wishlist')
    .get(sessionCheck,wishlist.viewWishlist)
    .patch(wishlist.addOrRemove)
    .delete(wishlist.remove)

    // Checkout

    router
    .route('/cart/checkout')
    .get(sessionCheck,checkOut.viewPage)
 
router.post("/cart/checkout/changeDefaultAddress",sessionCheck,checkOut.defaultAddress)


    router
    .route('/directCheckout')
     .get(sessionCheck, singleCheckOut.directCheckout)

router
    .route("/directCheckout/changeDefaultAddress")
    .post(sessionCheck, singleCheckOut.defaultAddress)


    // router
    // .route('/singleCheckout')
    // .get(sessionCheck, singleCheckOut.singleCheckout)


module.exports = router



