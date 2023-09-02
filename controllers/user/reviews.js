const reviewCollection = require("../../models/user/reviews");
const userCollection = require("../../models/user");


exports.addReview = async (req, res) => {
  try {
      const { productName, reviewTitle, rating, review } = req.body;
      const productID = req.query.productID;
      const customerID = req.session.userID;  // I assume you store user ID in session
      // console.log(productID)


      const newReview = new reviewCollection({
          customer: customerID,
          product: productID,
          reviewTitle,
          productName,
          rating,
          review
      });

      await newReview.save();
      res.json({
        success: "reviewAdded",
        message: "Review added successfully!",
      });

  } catch (error) {
      res.status(500).json({ success: false, message: "Error on adding new review:" + error });
  }
};

exports.editReview = async (req, res) => {
  try {
      const { reviewId, reviewTitle, rating, review } = req.body;
      await reviewCollection.findByIdAndUpdate(reviewId, {
          reviewTitle,
          rating,
          review
      });
      res.json({ success: true, message: "Review updated successfully" });
  } catch (error) {
      res.status(500).json({ success: false, message: "Error editing review: " + error.message });
  }
};


exports.helpful = async (req, res) => {
    if (req.session.userID != undefined) {
      await reviewCollection.findByIdAndUpdate(req.body.reviewID, {
        $inc: {
          helpful: 1,
        },
      });
      res.json({
        success: 1,
      });
    } else {
      res.json({
        success: 0,
      });
    }
  };
// exports.addReview = async(req, res) => {
//     try {
//         const currentUser = await userCollection.findById(req.session.userID);
        
//         let newReview = {
//             customer: req.session.userID,
//             product: req.query.productID,
//             title: req.body.reviewTitle, // capture the title
//             rating: req.body.rating,  // assuming rating will be passed from frontend
//             review: req.body.message, // assuming message will be passed from frontend
//         }
        
//         await reviewCollection.create(newReview);
//         res.json({ success: 1 });

//     } catch (error) {
//         res.redirect('/');
//         console.log("error on adding new review");
//     }
// }

