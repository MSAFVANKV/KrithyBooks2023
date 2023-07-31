
const userDTLS = require('../../models/user')
const productCollection = require('../../models/admin/products')
const categoryCollection=require("../../models/admin/category");



exports.categories=async(req,res)=>{
    try{
      
  let category=req.query.category;
  let page = parseInt(req.query.page) || 1;  // get the page from query parameter or default to 1
  let itemsPerPage = 12;
  let offset = (page - 1) * itemsPerPage;
  let listing;
  let currentUser=null;
  let  userCart=null;
  let currentCategory;

  if(req.session.userID){
    currentUser= await userDTLS.findOne({_id:req.session.userID})
  }

    if (category== "newReleases") {
      
      listing = await productCollection.find({listed: true}).skip(offset).limit(itemsPerPage).sort({ _id: -1 });      
      
      res.render("index/newReleasePage", {
        listing: listing,
        listingName: "New Releases",
        session:req.session.userID,
        userCart,
        currentUser,
        page,
        itemsPerPage,
        category  
      });
    } 
    }
    catch(error){
        res.redirect('/newReleaseProduct')
        console.log("Error categorizing in products page: " + error);
    }
}



