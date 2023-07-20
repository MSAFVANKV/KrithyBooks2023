const bcrypt=require("bcrypt");
const User=require("../../models/user")


  exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    
  
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(email=="" || password == ""){
        return res.render('user/partials/login', { message: 'Emplty field' });
    }
    if (!emailRegex.test(email)) {
      return res.render('user/partials/login', { message: 'Invalid email format' });
    }
  
    // Validate password length
    if (password.length < 6) {
      return res.render('user/partials/login', { message: 'Password should be at least 6 characters' });
    }
  
    try {
      // Check if the user exists
      const user = await User.findOne({ email:email });
      if (!user) {
        return res.render('user/partials/login', { message: 'User not found' });
      }
     
      // Compare the provided password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.render('user/partials/login', { message: 'Incorrect password' });
      }else{
        req.session.userID=user._id
        res.redirect("/")
      }

     
    //   req.session.userId= user._id
    } catch (error) {
      res.render('user/partials/login', { message: 'An error occurred' });
    }
  };
  
