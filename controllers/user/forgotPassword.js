const User=require("../../models/user");
const otpCollection=require("../../models/otp");
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

exports.viewPage = async (req, res) => {
    try{
        res.render("user/partials/forgotPassword", {
            documentTitle: "Forgot Password | User",
          })
    }
    catch(error){
        console.log("error rendering forgot password page"+error)
    }
}

exports.emailVerification=async(req,res,next)=>{

    try{
        
       const inputEmail=req.body.email;
       req.session.resetPasswordAuth = inputEmail;
       const emailCheck= await User.findOne({email:inputEmail});
       if(emailCheck){
        next()
       }else{
        res.render("user/partials/forgotPassword", {
            errorMessage: "User not found",
          });
       }

    }
    catch(error){
        console.log("error on email verification"+error);
    }
}


exports.otpSend=async(req,res)=>{
    try{
        inputEmail=req.session.resetPasswordAuth ;
        const tempOTP = Math.floor(Math.random() * (99999 - 10000 + 1))+ 25385;
        const newOtp=new otpCollection({
            email:inputEmail,
            otp:tempOTP,
          })
    
          await newOtp.save();
           // Transporter
           const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user:process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD
            }
        });
        req.session.resetOTP = tempOTP;
          // Mail options
         const mailOptions =  {
            from:process.env.SMTP_MAIL,
            to:inputEmail,
            subject: "Password Reset OTP | KRITHY BOOKS eCommerce",
            html: `<h1>OTP</h1></br><h2 style="text-color: red, font-weight: bold">${tempOTP}</h2></br><p>Enter the OTP to reset password.</p>`,
          };
    
          // Send mail
          await transporter.sendMail(mailOptions,(error,info)=>{
            if(error){
              console.log("otp sending error"+error);
            }else{
              console.log("Reset password OTP Sent: " + tempOTP);
            }
          });
          res.redirect("/forgotPassword/otpVerification");
    }
    catch(error){
        console.log("error sending otp " +error);
    }
}


exports.otpPage=async(req,res)=>{
    try{
        if (req.session.resetPasswordAuth && req.session.resetOTP) {
            res.render("user/partials/otp", {
              newUserDetails:null
            });
          } else {
            res.redirect("/login");
          }

    }
    catch(error){
        console.log("error on rendering otppage"+error)
    }
}


exports.otpVerification =async (req, res) => {
    if (req.session.resetPasswordAuth && req.session.resetOTP) {
    
      const resetOtpCheck = await otpCollection.findOne({otp:req.body.otp})
      if (resetOtpCheck) {
        req.session.resetOTP = false;
        req.session.updatePassword = true;
        console.log("Session created for user password change");
        res.redirect("/changePassword");
      } else {
        res.render("user/partials/otp", {
          errorMessage: "Invalid OTP",
          newUserDetails:null
        });
      }
    } else {
      res.redirect("/login");
    }
  };

exports.passwordChangePage=async(req,res)=>{
    try{
        if (req.session.updatePassword && req.session.resetPasswordAuth) {
            res.render("user/partials/changePassword", {
            });
          } else {
            res.redirect("/forgotPassword");
          }
    }
    catch(error){
        console.log("error on rendering passwordchange page "+ error)
    }
}

exports.updatePassword=async(req,res)=>{
   try{ if (req.session.resetPasswordAuth && req.session.updatePassword) {
      const  userEmail=req.session.resetPasswordAuth;
      const newPassword=req.body.newPassword;
      const hashedPassword= await bcrypt.hash(newPassword,10);
      await User.updateOne({email:userEmail},{$set:{password:hashedPassword}});
      req.session.updatePassword = false;
      req.session.resetPasswordAuth = false;
      console.log("User password updated.");
      res.redirect("/login");
      
    }else{

        res.redirect("/login");

    }}catch(error){
        console.log("password upadation error" +error)
    }
}