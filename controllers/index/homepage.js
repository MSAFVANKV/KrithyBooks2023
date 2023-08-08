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
const categoryDetails = require('../../models/admin/category') 
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
      const uniqueAuthorsWithTitles = newArrivals.map(product => 
        ({author: product.author, bookTitle: product.bookTitle}))
          .filter((item, index, self) => 
              index === self.findIndex((a) => (
              a.author._id.toString() === item.author._id.toString()
              ))
          );

          const uniqueCategoriesWithTitles = newArrivals.map(product => 
            ({category: product.category, thumbnail: product.thumbnail}))
              .filter((item, index, self) => 
                  index === self.findIndex((a) => (
                  a.category._id.toString() === item.category._id.toString()
                  ))
              );

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
          const allCategories=await categoryDetails.find();
          // console.log(allCategories,"check")
          res.render("index/categories", {
            session: req.session.userID,
            currentUser,
            categories: allCategories
          });
        } catch (error) {
          console.log("Error rendering category page: " + error);
        }
  };