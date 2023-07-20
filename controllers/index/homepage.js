const userDTLS = require('../../models/user')

exports.viewAll = async (req, res) => {
    try {
        let currentUser
       currentUser=await userDTLS.findById(req.session.userID)
        res.render('index/home', { message: "" , session:req.session.userID});
    } catch (error) {
        console.log("Error Occured"+error);
    }
}
