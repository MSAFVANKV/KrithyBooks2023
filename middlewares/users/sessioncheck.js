const sessionCheck = (req, res, next) => {
    if (req.session.userId) {
       
        next()
    } else {
        res.redirect('user/partials/login')
    }
}

module.exports = sessionCheck;