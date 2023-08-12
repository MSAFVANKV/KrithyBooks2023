const categoryCollection = require('../../models/admin/category')
const productCollection = require('../../models/admin/products')


exports.categoriesBy = async(req, res) => {
    try {
      let category = req.query.category;
      let page = parseInt(req.query.page) || 1;  
      let itemsPerPage = 12;
      let offset = (page - 1) * itemsPerPage;
      let listing;
      let currentUser = null;
      let userCart = null;
      let currentCategory;
      let sortBy = {};
  
      // Fetch all categories
      let categories = await categoryCollection.find({});
  
      if(req.session.userID){
        currentUser = await userDTLS.findOne({_id:req.session.userID});
      }
  
      // Check if the category exists in the DB.
      let categoryObject = categories.find(cat => cat.name === category);
  
      if(categoryObject) {
        // If category exists, fetch products based on its _id
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
  
        // If the category doesn't match any of the database categories, use other sorting methods
        listing = await productCollection.find({ listed: true })
                                        .skip(offset)
                                        .limit(itemsPerPage)
                                        .sort(sortBy);
      }
  
      res.render("index/categories", {
        listing: listing,
        listingName: categoryObject ? categoryObject.name : "New Releases",
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
