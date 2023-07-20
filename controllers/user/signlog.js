
const loginpage = require('../../database/mongodb')
const User = require('../../models/user')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const otpCollection = require('../../models/otp')
const cartCollection = require('../../models/cart');
const wishlistCollection = require('../../models/wishlist')


exports.signUpUser = async (req, res) => {
    const { username, email, password } = req.body;
    req.session.userDetails=req.body
  
    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (existingUser) {
        return res.render("user/partials/signup",{ message: 'User already exists' });
        
      }
      console.log("user");
      if(username == "" || email=="" || password == ""){
        return res.render('user/partials/signup', { message: 'Emplty field' });
    }
    if (!emailRegex.test(email)) {
        return res.render('user/partials/signup', { message: 'Invalid email format' });
      }
      if (password.length < 6) {
        return res.render('user/partials/signup', { message: 'Password should be at least 6 characters' });
      }
          // Generate and send OTP via email
          const tempOTP = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000; // 4-digit OTP
          const newOtp = new otpCollection({
            email: email.toLowerCase(),
            otp: tempOTP,
          });

    await newOtp.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: "mskvgames2023@gmail.com",
        pass: "cuwgrecfqhsaqclo"
      }
    });

    const mailOptions = {
      from: "mskvgames2023@gmail.com",
      to: email,
      subject: "OTP Verification for Signup",
      html: `<h1>OTP</h1><p>Your OTP for signup is: <strong>${tempOTP}</strong></p><p>Enter the OTP to complete your registration.</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("OTP sending error" + error);
        res.render('user/partials/signup', { message: 'Failed to send OTP. Please try again later.' });
      } else {
        console.log('OTP sent successfully' + tempOTP);
        res.render('user/partials/otp', { email: email });
      }
    });
      // Hash the password
      // const hashedPassword = await bcrypt.hash(password, 10);
  
      // // Create a new user
      // const newUser = new User
      // ({ username, email, password: hashedPassword });
  
       } 
      catch (error) {
      console.log(error);
      res.render('user/partials/signup', { message: 'An error occurred during signup' });
    }
  }

// ... Other code ...

exports.verifyOTP = async (req, res) => {
  const { otp } = req.body;
  console.log(otp)

  try {
    // Check if the email and OTP are defined
    if (!otp) {
      return res.render("user/partials/otp", { message: 'Invalid OTP or email missing' });
    }
    console.log("after otp")
    // Check if the provided OTP matches the saved OTP for the email
    const savedOTP = await otpCollection.findOne({ otp: otp });
    // console.log(otp)
    if (!savedOTP) {
      // Invalid OTP, render the OTP verification page with an error message
      return res.render("user/partials/otp", { message: 'Invalid OTP'});
    }

    // OTP is valid, create a new user and save to the database
    // Hash the password
    const hashedPassword = await bcrypt.hash(req.session.userDetails.password, 10);
    console.log("save password ")
    // Create a new user
    const newUser = new User({ username:req.session.userDetails.username, email:req.session.userDetails.email, password: hashedPassword });

    // Save the user to the database
    await newUser.save();
    req.session.userID=savedOTP._id

    console.log("User saved to the database:", newUser);

    // Respond with a success message
    // return res.render('user/partials/signup', { message: 'Signup successful' });
    return res.redirect('/verifyOTP')
    // res.render('user/partials/login');

  } catch (error) {
    console.log("Error verifying OTP or saving user:", error);
    // An error occurred during OTP verification or saving user to the database, render the OTP verification page with an error message
    return res.render("user/partials/otp", { message: 'An error occurred while verifying OTP'});
  }
};
    

  
// exports.verifyOTP = async (req, res) => {
  
//   const {otp} = req.body

//   try {

//     const otpHolder = await otpCollection.findOne({
//       otp:otp
//     });
//     if(otpHolder.length === 0){
//       return res.render("user/partials/otp")
//     }
//     const rightOtp = otpHolder[otpHolder.length - 1]
//     const hashedPassword = await bcrypt.hash(req.session.userDetails.password, 10);
//     if(rightOtp.session.userDetails.email === session.userDetails.email && hashedPassword){
     
//       const newUser = new User({ username:req.session.userDetails.username, email:req.session.userDetails.email, password: hashedPassword });

//     // Save the user to the database
//       await newUser.save();
//       console.log("User saved to the database:", newUser);
//       return res.redirect('/')
  
//     }
//     else{
//       return res.render("user/partials/otp");
 
//     }
    
//   } catch (error) {
//     console.log("Error verifying OTP or saving user:", error);
//     // An error occurred during OTP verification or saving user to the database, render the OTP verification page with an error message
//     return res.render("user/partials/otp", { message: 'An error occurred while verifying OTP'});

//   }
 

// }