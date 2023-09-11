const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  userId:{
    type: String
  },
  username: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    number: {
        type: Number,
      },
    photo: {
        type: String,
        default: "default_userPhoto.jpg",
      },
      age: {
        type: String,
      },
      landMark: {
        type: String,
      },
    access: {
        type: Boolean,
        default: true,
      },
    addresses: [
        {
          building: String,
          address: String,
          pincode: Number,
          country: String,
          contactNumber: Number,
          primary: Boolean,
        },
      ],
      cart: {
        type: mongoose.Types.ObjectId,
        ref: "Cart",
      },
      wishlist: {
        type: mongoose.Types.ObjectId,
        ref: "Wishlist",
      },
      review: {
        type: mongoose.Types.ObjectId,
        ref: "Review",
      },
      
      orders: [
        {
          type: mongoose.Types.ObjectId,
          ref: "Orders",
        },
      ],
      couponsUsed: [
        {
          type: mongoose.Types.ObjectId,
          ref: "Coupon",
        },
      ],
  },{ timestamps: true });

  const userDetails=mongoose.model('UserDetails',userSchema)
  module.exports=userDetails;