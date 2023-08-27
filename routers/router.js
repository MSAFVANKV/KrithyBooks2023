
const express = require('express');
const router = express.Router();
const signIn=require("../controllers/user/signIn");
const signlog = require('../controllers/user/signlog')
const sessionCheck = require('../middlewares/users/sessioncheck')
const homePage = require('../controllers/index/homepage')
const newproduct = require('../controllers/index/newReleaseProduct')
// const productPage = require('../controllers/productManager/product')
const forgotPassword = require('../controllers/user/forgotPassword')
const objectIdCheck = require('../middlewares/users/objectIdCheck')
const product = require('../controllers/index/product')
const categoriesByNovel = require('../controllers/index/category')
// const logout = require('../controllers/user/logout')


router.
      route('/')
      .get(homePage.viewAll)
      
router.
      route('/signup')
      .get(signlog.signUpPage)
      .post(signlog.signUpUser)

  
router.
      route('/verifyOTP')     
      .get(signlog.otpPage)
      .post(signlog.verifyOTP)

router.get("/signUp/resend_OTP",signlog.verifyOTP)


router.
      route('/login')
      .get(signIn.loginPage)
      .post(signIn.loginUser)


      // password change
router.
      route("/forgotPassword")
      .get(forgotPassword.viewPage)
      .post(forgotPassword.emailVerification,forgotPassword.otpSend)
router.get("/forgotPassword/otpVerification/resend_OTP",forgotPassword.otpSend)
      
router.get("/forgotPassword/otpVerification", forgotPassword.otpPage);
router.post("/forgotPassword/otpVerification", forgotPassword.otpVerification);

router.get("/changePassword",forgotPassword.passwordChangePage);
router.post("/changePassword",forgotPassword.updatePassword);

// password change=================
// ===================================


router.get("/categories", newproduct.categories)

// router.get("/newRelease", newproduct.categories)


// category pages 
router.get("/categoriesBy", homePage.categoryPage);

// filter
// router.post('/updateFilter', newproduct.updateFilter);



router
.route('/search')
 .get(newproduct.search)  


router
      .route("/products/:id")
      .get(objectIdCheck,product.view)
  
// router.
//       route('/sendotp')
//       .post(signIn.loginPage)
   
 
  // route.get('/verifyOTP', (req, res) => {
  //   res.render('user/partials/login', { message: "" });
  // });


// reset password

// logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log('Error destroying session:', err);
    }
    res.redirect('/');
  });
});



module.exports = router;





// router. 21/07/2023
//       route('/signup')
//       .get(signlog.signUpPage)
//       .post(signlog.signUpUser, signlog.otpPage)

  
// router.
//       route('/verifyOTP')
//       .get(signlog.otpPage)
//       .post(signlog.otpVerification)

// router.
//       route('/login')
//       .get(signIn.loginPage)
//       .post(signIn.loginUser)

