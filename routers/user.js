const express = require('express')
const router = express.Router();
const sessionCheck = require('../middlewares/users/sessioncheck')
const profile = require('../controllers/user/profile')
const croppedImgupload=require("../utilities/cropedImgUplod")
const address=require("../controllers/user/address");

const multer = require('multer');
// const multerS3 = require('multer-s3');
// const aws = require('aws-sdk');



var upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'assets/img/users');
        },
        filename: function (req, file, cb) {
            cb(null, `${req.session.userID}_${Date.now()}.jpeg`);
        }
    })
});



router
    .route('/profile')
    .get(sessionCheck,profile.viewPage)
    .post(sessionCheck,upload.single("photo"),profile.upadteUser)


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

//     router
// .route('/profile/manageAddress/save_image')
// .post(sessionCheck,upload.single('profileImage'),profile.uploadProfileImage);


    // router.post('/save_image', sessionCheck, upload.single('image'), profile.uploadProfileImage);





module.exports = router



