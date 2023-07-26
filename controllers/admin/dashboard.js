const adminuser =  require('../../models/admin/user')


exports.viewAdmin = async (req, res) => {
    try {
        let currentAdmin
         currentAdmin = adminuser.findOne(req.session.admin)
        res.render("admin/partial/dashboard", {sessionadmin: req.session.admin})
    } catch (error) {
        console.log("Error rendering admin signin Page: " + error);
    }
}