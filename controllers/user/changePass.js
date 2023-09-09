const userCollection = require('../../models/user');
const bcrypt = require('bcrypt')

exports.changePassword = async (req, res) => {

    try {
        userID = req.session.userID
      let currentUser = await userCollection.findById(userID)
      res.render("user/profile/partials/changePass",{
        currentUser,
        session:req.session.userID,
        currentUrl: req.originalUrl,
        message: req.flash('errorMessage'),
        showForgotPassword: req.flash('showForgotPassword')
      })
        
    } catch (error) {
      console.log("error rendering change password page:" + error)
        
    }

}

exports.updatePassword = async (req, res) => {
    try {
        const user = await userCollection.findById(req.session.userID);
        const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
        
        if (!isMatch) {
            req.flash('errorMessage','Incorrect Password!!')
            req.flash('showForgotPassword', 'true');
        return res.redirect("/users/profile/changePassword");
        }

        const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
        await userCollection.updateOne({_id: req.session.userID}, {$set: {password: hashedPassword}});
        
        console.log("User password updated.");
      return res.redirect("/login");  // Maybe redirect them to their profile instead?
    } catch (error) {
        console.log("Password updation error: " + error);
    }
};
