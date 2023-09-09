const sessionCheck = (req, res, next) => {
    if (req.session.userID) {
    //    console.log("entered to session")
        next()
    } else {
        res.redirect('/login')
    }
}

module.exports = sessionCheck;