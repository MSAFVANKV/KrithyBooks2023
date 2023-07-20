
const express = require('express');
const route = express.Router();
const signIn=require("../controllers/user/signIn");
const signlog = require('../controllers/user/signlog')
const sessionCheck = require('../middlewares/users/sessioncheck')
const homePage = require('../controllers/index/homepage')
// const logout = require('../controllers/user/logout')



route.get('/',homePage.viewAll)
  

route.get('/signup', (req, res) => {
  res.render('user/partials/signup', { message: "" });
});
route.get('/login', (req, res) => {
    res.render('user/partials/login', { message: "" });
  });
  route.get('/sendotp', (req, res) => {
    res.render('user/partials/otp', { message: "" });
  });
  route.get('/verifyOTP', (req, res) => {
    res.render('user/partials/login', { message: "" });
  });


  



route.post('/signup', signlog.signUpUser);
route.post('/login', signIn.loginUser); 
route.post('/verifyOTP', signlog.verifyOTP);


// reset password

// logout
route.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log('Error destroying session:', err);
    }
    res.redirect('/');
  });
});



module.exports = route;