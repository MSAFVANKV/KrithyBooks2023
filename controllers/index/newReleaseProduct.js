
const userDTLS = require('../../models/user')
const productCollection = require('../../models/admin/products')
const categoryCollection=require("../../models/admin/category");
const authorCollection = require('../../models/admin/author')
const cartCollection =require("../../models/cart")



// exports.categories=async(req,res)=>{
//     try{
      
//   let category=req.query.category;
//   let page = parseInt(req.query.page) || 1;  // get the page from query parameter or default to 1
//   let itemsPerPage = 12;
//   let offset = (page - 1) * itemsPerPage;
//   let listing;
//   let currentUser=null;
//   let  userCart=null;
//   let currentCategory;

//   if(req.session.userID){
//     currentUser= await userDTLS.findOne({_id:req.session.userID})
//   }

//     if (category== "newReleases") {
      
//       listing = await productCollection.find({listed: true}).skip(offset).limit(itemsPerPage).sort({ _id: -1 });      
      
//       res.render("index/newReleasePage", {
//         listing: listing,
//         listingName: "New Releases",
//         session:req.session.userID,
//         userCart,
//         currentUser,
//         page,
//         itemsPerPage,
//         category  
//       });
//     } 
//     }
//     catch(error){
//         res.redirect('/newReleaseProduct')
//         console.log("Error categorizing in products page: " + error);
//     }
// }
exports.categories = async(req, res) => {
  try {
    let category = req.query.category;
    let page = parseInt(req.query.page) || 1;  
    let itemsPerPage = 12;
    let offset = (page - 1) * itemsPerPage;
    let listing;
    let currentUser = null;
    let userCart 
    let currentCategory;
    let sortBy = {};

    // Fetch all categories
    let categories = await categoryCollection.find({});
    userCart= await cartCollection.findOne({customer:req.session.userID})


    if(req.session.userID){
      currentUser = await userDTLS.findOne({_id:req.session.userID});
    }

    // Check if the category exists in the DB.
    let categoryObject = categories.find(cat => cat.name === category);

    if(categoryObject) {
      // Category filtering
      listing = await productCollection.find({ category: categoryObject._id, listed: true })
                                      .skip(offset)
                                      .limit(itemsPerPage)
                                      .sort(sortBy);
    } else {
      switch(category) {
        case "newReleases":
          sortBy = { _id: -1 };
          break;
        case "ascending":
          sortBy = { price: 1 };
          break;
        case "descending":
          sortBy = { price: -1 };
          break;
      }

      listing = await productCollection.find({ listed: true })
                                      .skip(offset)
                                      .limit(itemsPerPage)
                                      .sort({_id:-1})
    }

    res.render("index/newReleasePage", {
      listing: listing,
      listingName: "New Releases",
      session: req.session.userID,
      userCart,
      currentUser,
      page,
      itemsPerPage,
      category,
      categories  // Pass the categories to your view
    });
  } catch(error) {
    res.redirect('/');
    console.log("Error categorizing in products page: " + error);
  }
};


exports.search = async (req, res) => {
  const searchInput = req.query.searchInput;
  try {
    // Look for matching categories
    let categoryMatches = await categoryCollection.find({ 
      name: { $regex: new RegExp(searchInput, "i") } 
    });

    let categoryIds = categoryMatches.map(c => c._id);

    // Look for matching authors
    let authorMatches = await authorCollection.find({
      name: { $regex: new RegExp(searchInput, "i") }
    });

    let authorIds = authorMatches.map(a => a._id);

    let products = await productCollection.find({ 
      $or: [
        { name: { $regex: new RegExp(searchInput, "i") }, listed: true },
        { category: { $in: categoryIds }, listed: true },
        { author: { $in: authorIds }, listed: true } // Add author search condition
      ]
    });

    res.json({ products });
    // res.redirect('/categories')
  } catch(err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred while searching products' });
  }
};

exports.updateFilter = async(req, res) => {
  try {
      const { categoryName, action } = req.body;
      const category = await categoryCollection.findOne({ name: categoryName });

      if (!category) {
          return res.status(400).send("Category not found");
      }

      // Assuming user has filters field as an array of category ids
      if (action === "add") {
          await userDTLS.updateOne({ _id: req.session.userID }, { $addToSet: { filters: category._id } });
      } else if (action === "remove") {
          await userDTLS.updateOne({ _id: req.session.userID }, { $pull: { filters: category._id } });
      }

      res.send("Updated successfully");
  } catch (error) {
      res.status(500).send("An error occurred");
      console.log("Error updating filter: ", error);
  }
};
