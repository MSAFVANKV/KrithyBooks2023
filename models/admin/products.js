const mongoose = require("mongoose");
const categoryDetails = require("./category");
const authorDetails=require("./author")

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    require,
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: 'Category',
    require,
  },
  author: {
    type: mongoose.Types.ObjectId,
    ref: 'Authors',
    require,
  },
  bookISBN : {
    type: Number,
    require,
  },
  publishingDate : Date,
  publisher: {
    type: String,
    require,
  },
  numOfPages : {
    type: Number,
    require,
  },
  language : {
    type: String,
    require,
  },
  initialPrice:Number,
  price: {
    type: Number,
    require,
  },
  thumbnail: {
    type: String,
    require,
  },
  frontImage: {
    type: String,
    require,
  },
  images: [String],
  offer:Number,
  stock: Number,
  listed: { type: Boolean, default: true },
  updatedBy: {
    type: mongoose.Types.ObjectId,
    ref: "ProductManagerDetails",
    default:null,
  }
});


const productCollection = mongoose.model("Products", productSchema);
module.exports = productCollection;
