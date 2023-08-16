const express = require('express')
const router = express.Router();
const sessionCheck = require('../middlewares/users/sessioncheck')
const profile = require('../controllers/user/profile')
const croppedImgupload=require("../utilities/cropedImgUplod")
const address=require("../controllers/user/address");
const cartPage = require('../controllers/user/cart')
const wishlist = require('../controllers/user/whishlist')

const multer = require('multer');
// const multerS3 = require('multer-s3');
// const aws = require('aws-sdk');



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
    .get(sessionCheck, profile.cropedImage)
    .post( sessionCheck, uploadCropped.single('photo'), profile.uploadCroppedImage);



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

    router
    .route('/profile/cartItems')
    .get(sessionCheck,cartPage.viewCart)
    .post(sessionCheck,cartPage.addToCart)
    .delete(sessionCheck,cartPage.removeProduct)
  .put(sessionCheck,cartPage.countChange)


    router
    .route('/profile/wishlist')
    .get(sessionCheck,wishlist.viewWishlist)
    .patch(wishlist.addOrRemove)
    .delete(wishlist.remove)

//     router
// .route('/profile/manageAddress/save_image')
// .post(sessionCheck,upload.single('profileImage'),profile.uploadProfileImage);


    // router.post('/save_image', sessionCheck, upload.single('image'), profile.uploadProfileImage);

module.exports = router



