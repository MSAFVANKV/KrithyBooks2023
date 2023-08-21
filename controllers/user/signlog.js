
const loginpage = require('../../database/mongodb')
const User = require('../../models/user')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const otpCollection = require('../../models/otp')
const cartCollection = require('../../models/cart');
const wishlistCollection = require('../../models/wishlist')
const mongoose=require("mongoose");
const twilio = require('twilio')


exports.signUpPage = (req, res) => {
  try {
    res.render("user/partials/signUp", { message: "" });
  } catch (error) {
    console.log("Error rendering user signup page: " + error);
  }
};


exports.signUpUser = async (req, res) => {
    const { username, email, password, number } = req.body;
    req.session.userDetails=req.body
  
    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      

      if (existingUser) {
        return res.render("user/partials/signup",{ message: 'User already exists' });
        
      }
      console.log("user");
      if(username == "" || email=="" || password == "" || number == ""){
        return res.render('user/partials/signup', { message: 'Emplty field' });
    }
    // if (!emailRegex.test(email)) {
    //     return res.render('user/partials/signup', { message: 'Invalid email format' });
    //   }
    //   if (password.length < 6) {
    //     return res.render('user/partials/signup', { message: 'Password should be at least 6 characters' });
    //   }
          // Generate and send OTP via email
          const tempOTP = Math.floor(Math.random() * (99999 - 10000 + 1))+ 25385;
          const newOtp = new otpCollection({
            email: email.toLowerCase(),
            otp: tempOTP,
          });

    await newOtp.save();

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: email,
      subject: "OTP Verification for Signup",
      html: `<h1>OTP</h1><p>Your OTP for signup is: <strong>${tempOTP}</strong></p><p>Enter the OTP to complete your registration.</p>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("OTP sending error" + error);
        // return res.render('user/partials/signup', { message: 'Failed to send OTP. Please try again later.' });
      } else {
        console.log('OTP sent successfully' + tempOTP);
        return res.redirect("/verifyOTP")
      }
    });   
       } 
      catch (error) {
      console.log(error);
      res.render('user/partials/signup', { message: 'An error occurred during signup' });
    }
  }
// ============================== is on !!! down
exports.verifyOTP = async (req, res) => {
  const { otp } = req.body;
  console.log(otp)

  try {
    // Check if the email and OTP are defined
    if (!otp) {
      return res.redirect("/verifyOTP")
    }
    console.log("after otp")
    // Check if the provided OTP matches the saved OTP for the email
    const savedOTP = await otpCollection.findOne({ otp: otp });
    // console.log(otp)
    if (!savedOTP) {
      // Invalid OTP, render the OTP verification page with an error message
      return res.redirect("/verifyOTP")
    }

    // OTP is valid, create a new user and save to the database
    // Hash the password
    const hashedPassword = await bcrypt.hash(req.session.userDetails.password, 10);
    console.log("save password ")
    // Create a new user
    console.log(req.session.userDetails)
    const newUser = new User({ username:req.session.userDetails.username, 
                              email:req.session.userDetails.email, 
                              password: hashedPassword, 
                              number:req.session.userDetails.number });

    // Save the user to the database
    await newUser.save();
    req.session.userID=savedOTP._id
    const userID = newUser._id
    const newCart = new cartCollection({
      customer:new  mongoose.Types.ObjectId(userID),
    });
    await User.findByIdAndUpdate(userID, {
      $set: { cart:new mongoose.Types.ObjectId(newCart._id) },
    });
    await newCart.save();

    // wishlist
    const newWishlist = new wishlistCollection({
      customer:new mongoose.Types.ObjectId(userID),
    });
    await User.findByIdAndUpdate(userID, {
      $set: { wishlist:new mongoose.Types.ObjectId(newWishlist._id) },
    });
    await newWishlist.save();

    console.log("User saved to the database:", newUser);

    // Respond with a success message
     res.redirect('/login')
     

  } catch (error) {
    console.log("Error verifying OTP or saving user:", error);
    return res.redirect("/verifyOTP")
  }
};

    
exports.otpPage = (req, res) => {
  try {
    const userExist=req.session.userExist;
    res.render("user/partials/otp", {
      message: "OTP Verification",
      userExist: req.session.userExist,
    });
  } catch (error) {
    console.log("Error rendering OTP Page: " + error);
  }
};







