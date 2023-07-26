
const userDTLS = require('../../models/user')

exports.newReleaseProduct = async (req, res) => {
    try {
        let currentUser
       currentUser=await userDTLS.findById(req.session.userID)
        res.render('index/newReleasePage', { message: "" , session:req.session.userID});
    } catch (error) {
        console.log("error while getting new product page"+error);
    }
}
