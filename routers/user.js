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
    .delete(sessionCheck,profile.deleteAddress)

    router
    .route('/profile/manageAddress/addressDelete')
    .delete(sessionCheck,profile.deleteAddress)

    router
    .route('/profile/manageAddress/editAddress')
    .put(sessionCheck,profile.editAddress)
module.exports = router



