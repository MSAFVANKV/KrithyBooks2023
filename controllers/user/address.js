const userCollection = require("../../models/user")


exports.defaultToggler=async(req,res)=>{
    try{
        const addressID=req.query.addressID;
        await userCollection.updateOne({_id:req.session.userID,"addresses.primary":true},{$set:{"addresses.$.primary":false}});
        await userCollection.updateOne({_id:req.session.userID,"addresses._id":addressID},{$set:{"addresses.$.primary":true}});
        res.redirect("/users/profile/manageAddress");
    }catch(error){
        res.redirect("/")
        cosnole.log("error on default toggler :"+error)
    }
}