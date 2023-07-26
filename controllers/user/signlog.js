
const loginpage = require('../../database/mongodb')
const User = require('../../models/user')
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')
const otpCollection = require('../../models/otp')
const cartCollection = require('../../models/cart');
const wishlistCollection = require('../../models/wishlist')
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
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      

      if (existingUser) {
        return res.render("user/partials/signup",{ message: 'User already exists' });
        
      }
      console.log("user");
      if(username == "" || email=="" || password == "" || number == ""){
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
         res.render('user/partials/otp');
      }
    });

    // Send SMS to phone number = twilio

    // const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
    // const phoneNumber = '+91' + req.body.number; // Assuming the phone number is in the format '+91XXXXXXXXXX'

    // twilioClient.messages
    //   .create({
    //     body: `Your OTP for signup is: ${tempOTP}`,
    //     from: process.env.TWILIO_PHONE_NUMBER, // Your Twilio phone number
    //     to: phoneNumber,
    //   })
    //   .then((message) => {
    //     console.log('OTP sent via Twilio: ' + message.sid);
    //     res.render('user/partials/otp', { email: email });
    //   })
    //   .catch((err) => {
    //     console.log('Error sending OTP via Twilio:', err);
    //     res.render('user/partials/signup', { message: 'Failed to send OTP. Please try again later.' });
    //   });
   
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
    console.log(req.session.userDetails)
    const newUser = new User({ username:req.session.userDetails.username, 
                              email:req.session.userDetails.email, 
                              password: hashedPassword, 
                              number:req.session.userDetails.number });

    // Save the user to the database
    await newUser.save();
    req.session.userID=savedOTP._id

    console.log("User saved to the database:", newUser);

    // Respond with a success message
     res.redirect('/login')
    // return res.redirect('/login')
    // res.render('user/partials/login'); 

  } catch (error) {
    console.log("Error verifying OTP or saving user:", error);
    // An error occurred during OTP verification or saving user to the database, render the OTP verification page with an error message
    return res.render("user/partials/otp", { message: 'An error occurred while verifying OTP'});
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







 // 21/07/2023

// ... Other code ...
// exports.signUpUser = async (req, res, next) =>{
//   try {
//     const email = req.body.email.toLowerCase();
//     const number = req.body.number;

//     console.log("passwrd")
//     const hashPswd = await bcrypt.hash(req.body.password, 10)
//     const userExist = {
//       username: req.body.username.trim(),
//       number: number,
//       email: email?.toLowerCase(),
//       password: hashPswd
      
//     }
    
//     req.session.userExist = userExist
//     const emailCheck= await User.findOne({email:email})
//      const numberCheck= await User.findOne({number:number}) 
//      if (emailCheck || numberCheck) {
//       res.render("user/partials/signUp", {
//         message: "User already existing"
//       });
//     }else{
//       next();
//     }
    
//   } catch (error) {
//     console.log("user registeratiion error"+error)
//   }
// }

// exports.sendOtp = async (req, res) => {
//   try {
//     if(req.session.userExist){
//       const email = req.session.userExist.email
//       const tempOTP = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000; // 4-digit OTP
//           const newOtp = new otpCollection({
//             email: email.toLowerCase(),
//             otp: tempOTP,
//           });
//           await newOtp.save();
          
//     const transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: process.env.SMTP_PORT,
//       secure: false,
//       auth: {
//         user: process.env.SMTP_MAIL,
//         pass: process.env.SMTP_PASSWORD
//       }
//     });

//     const mailOptions = {
//             from: process.env.SMTP_MAIL,
//             to: email,
//             subject: "OTP Verification for Signup",
//             html: `<h1>OTP</h1><p>Your OTP for signup is: <strong>${tempOTP}</strong></p><p>Enter the OTP to complete your registration.</p>`
//           };

//           await transporter.sendMail(mailOptions, (error, info) => {
//                   if (error) {
//                     console.log("OTP sending error" + error);
//                   } else {
//                     console.log('OTP sent successfully' + tempOTP);
//                   }
//                 });
//                 res.redirect("/verifyOTP");
//     }
//   } catch (error) {
//     console.log("error sending otp "+error)
//   }
// }


    
// exports.otpPage = (req, res) => {
//   try {
//     const userExist=req.session.userExist;
//     res.render("user/partials/otp", {
//       message: "OTP Verification",
//       userExist:userExist,
//     });
//   } catch (error) {
//     console.log("Error rendering OTP Page: " + error);
//   }
// };

// exports.otpVerification = async (req, res) =>{
//   try {
//     const otpChecker= await otpCollection.findOne({otp:req.body.otp})
//   if(otpChecker){
//     const userExist = new User(req.session.userExist)
//     userExist.save()
//     res.redirect("/signIn");
    
//     const savedOTP= await userDetails.findOne({email:otpChecker.email})
//     req.session.userID=savedOTP._id
//   }
//   } catch (error) {
//     console.log("Error verifying OTP: " + error);
//   }
  // 21/07/2023
// }

// ============================================================================
  
// exports.registerUser = async (req, res, next) => {
//   try{
//     const email = req.body.email?.toLowerCase();
//     const number = req.body.number;
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     const newUserDetails = {
//       username: req.body.username.trim(),
//       number: number,
//       email: email.toLowerCase(),
//       password: hashedPassword,
//     };
//     req.session.newUserDetails = newUserDetails;
//     const emailCheck= await User.findOne({email:email})
//    const numberCheck= await User.findOne({number:number})
//     if (emailCheck || numberCheck) {
//       res.render("user/partials/signUp", {
//         message: "User already existing",
//       });
//     }else{
//       next();
//     }
    
   
//   }
//   catch(error){
// console.log("user registeratiion error"+error)
    
//   }

// }
  
// exports.sendOtp=async(req,res)=>{
//   try{
//     if(req.session.newUserDetails){
//     const email = req.session.newUserDetails.email;
//     // const number = req.session.newUserDetails.number;

//     const tempOTP = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000; // 4-digit OTP
//       const newOtp=new otpCollection({
//         email:email.toLowerCase(),
//         otp:tempOTP,
//       })

//       await newOtp.save();
//       //  Transporter
//     const transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: process.env.SMTP_PORT,
//       secure: false,
//       auth: {
//         user: process.env.SMTP_MAIL,
//         pass: process.env.SMTP_PASSWORD
//       }
//     });

//     const mailOptions = {
//       from: process.env.SMTP_MAIL,
//       to: email,
//       subject: "OTP Verification for Signup",
//       html: `<h1>OTP</h1><p>Your OTP for signup is: <strong>${tempOTP}</strong></p><p>Enter the OTP to complete your registration.</p>`
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.log("OTP sending error" + error);
//         res.render('user/partials/signup', { message: 'Failed to send OTP. Please try again later.' });
//       } else {
//         console.log('OTP sent successfully' + tempOTP);
//         res.render('user/partials/otp', { email: email });
//       }
//     });

//       //twilio

//       // twilio.messages.create({
//       //   from:process.env.Twilio_ph_no,
//       //   to: "+91"+req.session.newUserDetails.number ,
//       //   body: `<h1>OTP</h1></br><h2 style="text-color: red, font-weight: bold">${tempOTP}</h2></br><p>Enter the OTP to create account.</p>`
//       // }).then((res)=>{console.log("message sent by twilio")}).catch((err)=>{console.log("error :"+err)})

      

      
//       res.redirect("/verifyOTP");
    
//     }else{
//       res.redirect("/verifyOTP")
//     }
//   }catch(error){
//     console.log("error sending otp "+error)
//   }
// }


// exports.otpPage = (req, res) => {
//   try {
//     const newUserDetails=req.session.newUserDetails;
//     res.render("user/partials/otp", {
//       message: "OTP Verification",
//       newUserDetails:newUserDetails,
//     });
//   } catch (error) {
//     console.log("Error rendering OTP Page: " + error);
//   }
// };



// exports.verifyOTP = async (req, res) => {
//   console.log("header")

//   try {
//     const otpChecker= await otpCollection.findOne({otp:otp})
//     // Check if the email and OTP are defined
//     if (otpChecker) {
//       const newUserDetails = new User(req.session.newUserDetails);
//       newUserDetails.save();
//       res.redirect("/users/signIn");    
//     }
   


//   } catch (error) {
//     console.log("Error verifying OTP or saving user:", error);
//     // An error occurred during OTP verification or saving user to the database, render the OTP verification page with an error message
//     return res.render("user/partials/otp", { message: 'An error occurred while verifying OTP'});
//   }
// };
