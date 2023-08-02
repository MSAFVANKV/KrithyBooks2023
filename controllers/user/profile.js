const mongoose = require('mongoose');
const userCollection = require('../../models/user')

// profile view page
exports.viewPage = async (req, res) => {
    try {
        let userID = req.session.userID
        let currentUser = await userCollection.findById(userID)
// console.log(currentUser);
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
        // console.log(currentUser);
    res.render("user/profile/partials/addAddress", {
    currentUser,
    session: req.session.userID,
})
    } catch (error) {
        res.redirect('/');
        console.log("error on rendering profile page:" + error)
    }
}


exports.addAddress = async (req, res) => {
    try {
        let userID = req.session.userID;
        let currentUser = await userCollection.findOne({_id: userID});
        if(currentUser){
            console.log(userID);
            console.log(currentUser);

            await userCollection.updateOne({_id: userID},
                {
                    $push: {
                        addresses:{
                            building: req.body.building,
                            address: req.body.address,
                            pincode: req.body.pincode,
                            country: req.body.country,
                            contactNumber: req.body.contactNumber,
                            primary: true,
                        }
                    }
                }
            );
            currentUser = await userCollection.findById(userID);
            res.redirect('/users/profile/manageAddress?addressAdded=true');
        }
               
    } catch (error) {
        console.log("Error while adding address:" + error);
        res.redirect('/users/profile');
    }
}


exports.deleteAddress = async (req, res) =>{
    try {
        let addressID = req.body.addressID;
        let userID = req.session.userID;
        let currentUser = await userCollection.findOne({_id: userID});
        if(currentUser){
            await userCollection.updateOne({_id: userID},
                {
                    $pull: {
                        addresses: { 
                            _id: addressID
                        }
                    }
                })
        }
        res.send("deleted")
    } catch (error) {
        console.log("Error while deleting Address"+error);
        res.redirect('/users/profile/manageAddress')
    }
}

// address editing page
exports.editAddress = async (req, res) => {
    try {
        let addressID = req.body.addressID;
        let userID = req.session.userID;
        let currentUser = await userCollection.findOne({_id: userID});
        if(currentUser){
            await userCollection.updateOne({
                _id: userID,
                addresses: {
                    $elemMatch: { _id: new mongoose.Types.ObjectId(addressID) },
                },
            },
            {
                $set: {
                    "addresses.$.building": req.body.building,
                    "addresses.$.address": req.body.address,
                    "addresses.$.pincode": req.body.pincode,
                    "addresses.$.country": req.body.country,
                    "addresses.$.contactNumber": req.body.contactNumber,
                }
            })
        }
        res.redirect('/users/profile/manageAddress?addressEdited=true')
    } catch (error) {
        
    }
}