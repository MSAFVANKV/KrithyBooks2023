const userDTLS = require('../../models/user')

exports.productView = async (req, res) => {
    try {
        let currentUser
       currentUser=await userDTLS.findById(req.session.userID)
        res.render('index/productShowPage', { message: "" , session:req.session.userID});
    } catch (error) {
        console.log("Error Occured"+error);
    }
}