const mongoose = require('mongoose');
const userCollection = require('../../models/user')


exports.viewPage = async (req, res) => {
    try {
        let userID = req.session.userID
        let currentUser = await userCollection.findById(userID)
console.log(currentUser);
res.render("user/profile/partials/profile", {
    currentUser,
    session: req.session.userID
})
    } catch (error) {
        res.redirect('/');
        console.log("error on rendering profile page:" + error)
    }
}


exports.addressViewPage = async (req, res) => {
    try {
        let userID = req.session.userID
        let currentUser = await userCollection.findById(userID)
        console.log(currentUser);
    res.render("user/profile/partials/addAddress", {
    currentUser,
    session: req.session.userID
})
    } catch (error) {
        res.redirect('/');
        console.log("error on rendering profile page:" + error)
    }
}


exports.addAddress = async (req, res) => {
    try {
        let userID = req.session.userID;
        let currentUser = await userCollection.findById(userID);
        if(currentUser){
            console.log(req.body.userID);
            await userCollection.updateOne({_id: userID._id},
                {
                    $push: {
                        addresses:{
                            building: req.body.building,
                            address: req.body.address,
                            pincode: req.body.pincode,
                            country: req.body.country,
                            contactNumber: req.body.contactNumber,
                            primary: false,
                        }
                    }
                }
            );
            currentUser = await userCollection.findById(userID);
        }
        res.redirect('/users/profile/manageAddress',{
            currentUser 
        });
    } catch (error) {
        console.log("Error while adding address:" + error);
        res.redirect('/users/profile');
    }
}
