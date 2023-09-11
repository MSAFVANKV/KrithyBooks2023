const mongoose = require('mongoose');

// reviewSchema
const reviewSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Types.ObjectId,
        ref: "UserDetails",
    },
    reviews: [{
        product: {
            type: mongoose.Types.ObjectId,
            ref: "Products",
        },
        reviewTitle: String,
        productName: String,
        rating: {
            type: Number,
            min: 1,
            max: 5,
        },
        review: String,
        createdAt: {
            type: Date,
            default: Date.now,
        },
        helpful: {
            type: Number,
            default: 0,
        },
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const ReviewCollection = mongoose.model("Review",reviewSchema);
module.exports = ReviewCollection;