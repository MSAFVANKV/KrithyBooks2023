const authorCollection = require('../../models/admin/author');
const productCollection = require('../../models/admin/products');
const usercollection =require('../../models/user')


exports.authorView = async(req, res) => {
    try {
        const authorId = req.query.author;
        console.log(`Searching for products in category: ${authorId}`);

        let products = [];
        
        const authorObj = await authorCollection.findById(authorId);
        const allAuthors = await authorCollection.find();

        const listingName = authorObj ? authorObj.name : "Default Listing Name";

        

        if (authorId) {
            products = await productCollection.find({ author: authorId, listed:true })
                                             .populate("category")
                                             .populate("author");
        }
         else {
              console.log("No authorId provided in the request.");
          }
        
         const authorBooks = await productCollection.find({ author: authorId })
         .limit(10);


          res.render("index/authorBooks", {
            session: req.session.userID,
            products: authorBooks,
            listingName: listingName,
            allAuthors,
            selectedAuthor: authorObj,
            documentTitle : allAuthors.author.name
          });

    } catch (error) {
        res.redirect('/pageNotFound');
        console.log("Error rendering category page: " + error);
    }
}
