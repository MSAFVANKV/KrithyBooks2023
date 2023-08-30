
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
// exports.categories = async(req, res) => {
//   try {
//     let category = req.query.category;
//     console.log(category,'category')
//     let page = parseInt(req.query.page) || 1;  
//     let itemsPerPage = 12;
//     let offset = (page - 1) * itemsPerPage;
//     let listing;
//     let currentUser = null;
//     let userCart 
//     let currentCategory;
//     let sortBy = {};
//     let errorMessage = null;
//     let categoryArray;

//     // Fetch all categories
//     let categories = await categoryCollection.find({});
//     userCart= await cartCollection.findOne({customer:req.session.userID})


//     if(req.session.userID){
//       currentUser = await userDTLS.findOne({_id:req.session.userID});
//     }

//     // Check if the category exists in the DB.
//     // let categoryObject = categories.find(cat => cat.name === category);
//     const categoryObject = categories.filter(cat => categoryArray.includes(cat.name));

//     console.log(categoryObject,'fddhbs')

//     if(categoryObject) {
//       // Category filtering
//       listing = await productCollection.find({ category: categoryObject._id, listed: true })
//                                       .skip(offset)
//                                       .limit(itemsPerPage)
//                                       .sort(sortBy);
//     } else {
//       switch(category) {
//         case "newReleases":
//           sortBy = { _id: -1 };
//           break;
//         case "ascending":
//           sortBy = { price: 1 };
//           break;
//         case "descending":
//           sortBy = { price: -1 };
//           break;
//       }

//       listing = await productCollection.find({ listed: true })
//                                       .skip(offset)
//                                       .limit(itemsPerPage)
//                                       .sort(sortBy)
//     }

//     if (listing.length === 0) {
//       errorMessage = 'No Products Available, Check the spelling!';
//     }


//     res.render("index/newReleasePage", {
//       listing: listing,
//       listingName: "New Releases",
//       session: req.session.userID,
//       userCart,
//       currentUser,
//       page,
//       itemsPerPage,
//       category,
//       categories, 
//       errorMessage:errorMessage
//     });
//   } catch(error) {
//     res.redirect('/');
//     console.log("Error categorizing in products page: " + error);
//   }
// };
exports.categories = async(req, res) => {
  try {
    let category = req.query.category || [];
    // If the category is a string, make it an array
    if (typeof category === 'string') {
      category = [category];
    }
    console.log(category, 'category');
    
    let page = parseInt(req.query.page) || 1;  
    let itemsPerPage = 12;
    let offset = (page - 1) * itemsPerPage;
    let listing;
    let currentUser = null;
    let userCart;
    let sortBy = {};
    let errorMessage = null;

    // Fetch all categories
    let categories = await categoryCollection.find({});
    userCart = await cartCollection.findOne({customer:req.session.userID});

    if(req.session.userID) {
      currentUser = await userDTLS.findOne({_id:req.session.userID});
    }

    // Check if the category exists in the DB.
    let categoryObjects = categories.filter(cat => category.includes(cat.name));
    let categoryIDs = categoryObjects.map(obj => obj._id); // get all matching category ids

    if(categoryIDs.length > 0) {
      // Category filtering
      listing = await productCollection.find({ category: { $in: categoryIDs }, listed: true })
                                      .skip(offset)
                                      .limit(itemsPerPage)
                                      .sort(sortBy);
    } else {
      let categoryString = Array.isArray(category) ? category.join(',') : category;
      switch(categoryString) {
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
                                      .sort(sortBy);
    }

    if (listing.length === 0) {
      errorMessage = 'No Products Available, Check the spelling!';
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
      categories, 
      errorMessage: errorMessage
    });

  } catch(error) {
    res.redirect('/');
    console.log("Error categorizing in products page: " + error);
  }
};


exports.search = async (req, res) => {
  const searchInput = req.query.searchInput;
  try {
    
    let page = parseInt(req.query.page) || 1;
    let itemsPerPage = 12;
    let errorMessage = null
    let category = req.query.category;
    let searchInput = req.query.searchInput;
    let sortBy = {};
    let currentUser = null;
    let userCart = null;
    // Look for matching categories
    let categories = await categoryCollection.find({});
    let categoryMatches = await categoryCollection.find({ 
      name: { $regex: new RegExp(searchInput, "i") } 
    });

    let categoryIds = categoryMatches.map(c => c._id);
 
    
    if(req.session.userID){
      currentUser = await userDTLS.findOne({_id:req.session.userID});
      userCart = await cartCollection.findOne({customer:req.session.userID});
    }
    
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

    if (products.length === 0) {
      errorMessage = 'No Products Available, Check the spelling!';
    }

    // res.json({ products });
     res.render("index/newReleasePage", {
      listing: products,
      listingName: "Search Results for: " + searchInput,
      session: req.session.userID,
      userCart,
      currentUser,
      page,
      itemsPerPage,
      category,
      categories,
      errorMessage: errorMessage
    });

  } catch(err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred while searching products' });
  }
};
