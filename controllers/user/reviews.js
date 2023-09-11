const reviewCollection = require("../../models/user/reviews");
const userCollection = require("../../models/user");
const { default: mongoose } = require("mongoose");


// exports.addReview = async (req, res) => {
//   try {
//       const { productName, reviewTitle, rating, review } = req.body;
//       const productID = req.query.productID;
//       const customerID = req.session.userID;  // I assume you store user ID in session
//       // console.log(productID)


//       const newReview = new reviewCollection({
//           customer: customerID,
//           product: productID,
//           reviewTitle,
//           productName,
//           rating,
//           review
//       });

//       await newReview.save();
//       res.json({
//         success: "reviewAdded",
//         message: "Review added successfully!",
//       });

//   } catch (error) {
//       res.status(500).json({ success: false, message: "Error on adding new review:" + error });
//   }
// };

exports.addReview = async (req, res) => {
  try {
      const { productName, reviewTitle, rating, review } = req.body;
      const productID = req.query.productID;
      const customerID = req.session.userID; // Assuming you store user ID in session

      // Find the existing review document for the user
      const userReviewDoc = await reviewCollection.findOne({ customer: customerID });

      // Check if the review document exists
      if(!userReviewDoc) {
          return res.status(400).json({ success: false, message: "No review document found for user." });
      }

      const newReview = {
          product: productID,
          reviewTitle,
          productName,
          rating,
          review,
          createdAt: Date.now()
      };

      userReviewDoc.reviews.push(newReview);
      await userReviewDoc.save();

      res.json({
          success: "reviewAdded",
          message: "Review added successfully!",
      });

  } catch (error) {
    console.error("Server Error:", error);
      res.status(500).json({ success: false, message: "Error on adding new review:" + error });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const userId = req.session.userID;
    const reviewId = req.query.id;
console.log(reviewId)

    const user = await userCollection.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Remove the specific review from the user's review document
    await reviewCollection.updateOne(
      { "customer": new mongoose.Types.ObjectId(userId) },
      { $pull: { reviews: { "_id": new mongoose.Types.ObjectId(reviewId) } } }
    );
    
    // console.log(reviews)

    res.json({
      success: "removedreview",
      message: "Review deleted successfully!",
    });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ success: false, message: "Error deleting review: " + error.message });
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

