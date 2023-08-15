// const userDTLS = require('../../models/user')

// exports.viewAll = async (req, res) => {
//     try {
//         let currentUser
//        currentUser=await userDTLS.findById(req.session.userID)
//         res.render('index/home', { message: "" , session:req.session.userID});
//     } catch (error) {
//         console.log("Error Occured"+error);
//     }
// }

const userDTLS = require('../../models/user')
const productCollection = require('../../models/admin/products')
const authorsDetails = require('../../models/admin/author')
const categoryDetails = require('../../models/admin/category');


exports.viewAll = async (req, res) => {
    try {
        let currentUser

        if(req.session.userID){
            currentUser=await userDTLS.findById(req.session.userID)
        }
        const allAuthors=await authorsDetails.find();
        // console.log(allAuthors,"check")
        const allProducts=await productCollection.find({listed:true})
                                             .populate("category")
                                             .populate("author").sort({_id:-1})
       let newArrivals = allProducts.slice(0,8)

      //  to get unique authors // remove same authors
      const uniqueAuthorsWithTitles = allAuthors.map(author => {
        const relatedProduct = allProducts.find(product => product.author._id.toString() === author._id.toString());
        return {
            author: author,
            bookTitle: relatedProduct ? relatedProduct.bookTitle : "default_title"
        };
    });
    

    const uniqueCategoriesWithTitles = allProducts.map(product => 
      ({
          category: product.category, 
          thumbnail: product.thumbnail
      })
  )
  .filter((item, index, self) => 
      index === self.findIndex((a) => (
          a.category._id.toString() === item.category._id.toString()
      ))
  );
  
          // const uniqueCategoriesWithTitles = newArrivals.map(product => 
          //   ({category: product.category, thumbnail: product.thumbnail}))
          //     .filter((item, index, self) => 
          //         index === self.findIndex((a) => (
          //         a.category._id.toString() === item.category._id.toString()
          //         ))
          //     );

        res.render("index/home", {
          session: req.session.userID,
          currentUser,
          newArrivals,
          message:"",
          session:req.session.userID,
          authors: uniqueAuthorsWithTitles,
          categories: uniqueCategoriesWithTitles
        });
      
      } catch (error) {
        console.log("Error rendering landing page: " + error);
      }
    };
    
    exports.errorPage=(req,res)=>{
      res.render("index/404",{
        url:req.session.url
      })
        
    
    }


    exports.categoryPage = async (req, res) => {
      try {
          const categoryId = req.query.category;
          console.log(`Searching for products in category: ${categoryId}`);
          let products = [];

          const categoryObj = await categoryDetails.findById(categoryId);
          const allCategories = await categoryDetails.find();

          const listingName = categoryObj ? categoryObj.name : "Default Listing Name";

        
          if (categoryId) {
            products = await productCollection.find({ category: categoryId, listed:true })
                                             .populate("category")
                                             .populate("author");
        }
         else {
              console.log("No categoryId provided in the request.");
          }
    
          res.render("index/categories", {
              session: req.session.userID,
              products: products,
              listingName: listingName,
              categories: allCategories
              
          });
      } catch (error) {
          console.log("Error rendering category page: " + error);
      }
    };
      



//   exports.categoryPage = async (req, res) => {
//     try {
//         let category = req.query.category;
//         let products = [];
//         let page = parseInt(req.query.page) || 1;  
//         let itemsPerPage = 12;
//         let offset = (page - 1) * itemsPerPage;
//         let sortBy = {};
//         let listing;


//         // Fetch all categories
//         let categories = await categoryCollection.find({});

//         let categoryObject = categories.find(cat => cat.name === category);

//         if (categoryObject) {
//             products = await productCollection.find({ category: categoryObject._id })
//             .populate("category")
//             .populate("author")
//             .skip(offset)
//             .limit(itemsPerPage)
//             .sort(sortBy);
//         }
//         listing = await productCollection.find({ listed: true })
//                                       .skip(offset)
//                                       .limit(itemsPerPage)
//                                       .sort(sortBy);

//         res.render("index/categories", {
//             session: req.session.userID,
//             products: products,
//             categories,
//             page,
//             itemsPerPage,
//             listing: listing,

//         });
//     } catch (error) {
//         console.log("Error rendering category page: " + error);
//     }
// };
