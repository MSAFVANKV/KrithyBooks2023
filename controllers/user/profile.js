const mongoose = require('mongoose');
const userCollection = require('../../models/user');
// const fs = require('fs');
// const path = require('path');


// profile view page
exports.viewPage = async (req, res) => {
    try {
        let userID = req.session.userID
        let currentUser = await userCollection.findById(userID)
        let allAddresses=currentUser.addresses;
        if (allAddresses == "") {
            allAddresses = null;
          }
// console.log(currentUser);
res.render("user/profile/partials/profile", {
    currentUser,
    session: req.session.userID,
    allAddresses
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
            // console.log(userID);
            // console.log(currentUser);
            await userCollection.updateOne({ _id: userID , "addresses.primary":true}, {
                $set:{'addresses.$.primary':false}
               })
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

// exports.updateUser = async (req, res) => {
//     try {
//         const userID = req.session.userID;
//         let filteredBody = {
//             username: req.body.username,
//             age: req.body.age,
//             landMark: req.body.landMark,
//             number: req.body.number
//         };
//         if (req.file) {
//             filteredBody.photo = req.file.filename;
//         }
//         // await userCollection.findByIdAndUpdate(userID, filteredBody); if only change number use this line!!!!!!!!
//         // =============
//         // if need change address number with update profile use this 2 line
//         await userCollection.updateOne({_id: userID}, {$set: filteredBody}); // if need change address number with update profile use this 2 line
//         // Update contactNumber in all addresses
//         await userCollection.updateMany({_id: userID, 'addresses.primary': true}, {$set: {'addresses.$.contactNumber': req.body.number}});
//         // ================================
//         res.redirect("/users/profile");

//     } catch (error) {
//         res.redirect("/users/profile");
//         console.log("error on profile updation:" + error)
//     }
// }

exports.updateUser = async (req, res) => {
    try {
        const userID = req.session.userID;
        const currentUser = await userCollection.findById(userID);

        // Other user details update
        currentUser.username = req.body.username;
        currentUser.age = req.body.age;
        currentUser.landMark = req.body.landMark;
        currentUser.number = req.body.number;

        await currentUser.save();

        // If you update the contact number, update it in all addresses as well
        if (req.body.number) {
            await userCollection.updateMany(
                { _id: userID, 'addresses.primary': true },
                { $set: { 'addresses.$.contactNumber': req.body.number } }
            );
        }

        res.redirect("/users/profile");

    } catch (error) {
        res.redirect("/users/profile");
        console.log("error on profile updation:" + error);
    }
};




exports.uploadCroppedImage = async (req, res) => {
    try {
        const userID = req.session.userID;
        const currentUser = await userCollection.findById(userID);
        if (currentUser && req.file) {
            await userCollection.updateOne({_id: userID}, {$set: {photo: req.file.filename}});
            res.json({ imageUrl: '/img/users/' + req.file.filename });
        } else {
            res.status(400).send("Error: User not found or image not provided");
        }
    } catch (error) {
        console.log("Error while saving cropped image:", error);
        res.status(500).send("Internal Server Error");
    }
};

exports.cropedImage = async (req, res) => {
    try {
        let userID = req.session.userID
        let currentUser = await userCollection.findById(userID)
        // console.log(currentUser);
    res.render("user/profile/partials/cropedImage", {
    currentUser,
    session: req.session.userID,
})
    } catch (error) {
        res.redirect('/');
        console.log("error on rendering profile page:" + error)
    }
}

