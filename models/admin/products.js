
const mongoose = require("mongoose");
const categoryDetails = require("./category");
const authorsDetails = require('./author')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    require,
  },
  author: {
    type: mongoose.Types.ObjectId,
    ref: authorsDetails,
    require,
  },
  category: {
    type: mongoose.Types.ObjectId,
    ref: categoryDetails,
    require,
  },
  numOfPages: {
    type: Number,
    require,
  },
  publisher: {
    type: String,
    require,
  },
  language: {
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
  },
  createdAt:{
    type:Date,
    default:Date.now,
}
});


const productCollection = mongoose.model("Products", productSchema);
module.exports = productCollection;
