const express = require('express')
const router = express.Router();
const sessionCheck = require('../middlewares/users/sessioncheck')
const profile = require('../controllers/user/profile')



router
    .route('/profile')
    .get(sessionCheck,profile.viewPage)

    router
    .route('/profile/manageAddress')
    .get(sessionCheck,profile.addressViewPage)
    .post(sessionCheck,profile.addAddress)



module.exports = router



