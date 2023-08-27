const { default: mongoose } = require("mongoose");
const cartCollection=require("../../models/cart");
const userCollection=require("../../models/user");
const couponCollection=require("../../models/admin/coupons");
const productCollection = require('../../models/admin/products')
const orderCollection = require('../../models/order')
const nodemailer = require("nodemailer")
const paypal=require("paypal-rest-sdk");
const Razorpay=require("razorpay")
// const stripe = require('stripe')(process.env.Secret_key);
// const { Secret_key,Publishable_key } = process.env;

exports.viewPage=async(req,res)=>{
    try{
      //   userID = req.session.userID
      // let currentUser = await userCollection.findById(userID)

        const userCart=await cartCollection.findOne({customer:req.session.userID}).populate("products.name");
        let products=userCart.products;

     if(userCart.totalQuantity != 0){
        let allAddresses=await userCollection.findById(req.session.userID);
        allAddresses=allAddresses.addresses;
        let defaultAddress=await userCollection.aggregate([
            {$match:{_id:new mongoose.Types.ObjectId(req.session.userID)}},
            {$unwind:"$addresses"},
            {$match:{"addresses.primary":true}}
        ]);
        let coupons= await couponCollection.find()
        if (defaultAddress != ""){
            defaultAddress = defaultAddress[0].addresses;
          } else {
            defaultAddress = 0;
          }
        res.render("user/profile/partials/checkout", {
            defaultAddress,
            products,
            userCart,
            allAddresses,
            coupons,
            documentTitle: "Krithy Books ",
            session:req.session.userID,
            currentUrl: req.originalUrl,
            // Publishable_key:process.env.Publishable_key
          });}else {
            res.redirect("/users/cart");
          }

    }catch(error){
        res.redirect("/users/cart");
         console.log('error on rendering checkoutpage :'+error)
    }
}


exports.defaultAddress = async(req, res) => {
  try {
      console.log("Inside defaultAddress function");
      
      const userID = req.session.userID;
      const DefaultAddress = req.body.DefaultAddress;
      console.log("UserID:", userID, "DefaultAddress:", DefaultAddress);

      await userCollection.updateMany(
          { _id: userID, "addresses.primary": true },
          { $set: { "addresses.$.primary": false } }
      );
      await userCollection.updateOne(
          { _id: userID, "addresses._id": DefaultAddress },
          { $set: { "addresses.$.primary": true } }
      );

      console.log("Address updated successfully");
      res.redirect("/users/cart/checkout");
  } catch (error) {
      console.log("Error in defaultAddress:", error);
      res.redirect("/users/cart/checkout");
  }
}


exports.couponCheck=async(req,res)=>{
  try{
    const couponCode=req.body.couponCode;
    const userCart= await cartCollection.findOne({
      customer:req.session.userID
    });
    const cartPrice= userCart.totalPrice;
    if(couponCode==''){

      res.json({
        data: {
          couponCheck: null,
          discountPrice: 0,
          discountPercentage: 0,
          finalPrice: userCart.totalPrice,
        },
      });
    }else{
       const coupon=await couponCollection.findOne({code:couponCode});
       let discountPercentage = 0;
      let discountPrice = 0;
      let finalPrice = cartPrice;
      if(coupon){
        const alreadyUsedCoupon= await userCollection.findOne({
          _id: req.session.userID,
          couponsUsed: coupon._id,
        });
      if(coupon.qty !== 0){
        if(!alreadyUsedCoupon){
          if (coupon.active == true) {
            const currentTime=new Date().toJSON();
            if(currentTime > coupon.startingDate.toJSON()){
              if(currentTime < coupon.expiryDate.toJSON()){
                discountPercentage = coupon.discount;
                discountPrice = (discountPercentage / 100) * cartPrice;
                discountPrice = Math.floor(discountPrice)
                finalPrice = cartPrice - discountPrice;

                couponCheck =
                  '<b>Coupon Applied <i class="fa fa-check text-success" aria-hidden="true"></i></b></br>' +
                  coupon.name;

              }else{
                couponCheck= "<b style='font-size:0.75rem; color: red'>Coupon expired<i class='fa fa-stopwatch'></i></b>";
              }

            }else{
              couponCheck = `<b style='font-size:0.75rem; color: green'>Coupon starts on </b><br/><p style="font-size:0.75rem;">${coupon.startingDate}</p>`;
            }

          }else{
            couponCheck = "<b style='font-size:0.75rem;color: red'>Invalid Coupon !</b>";
          }

        }else{
          couponCheck = "<b style='font-size:0.75rem;color: red'>Coupon already used !</b>";
        } }else{
          couponCheck = "<b style='font-size:0.75rem;color: red'>Coupon Finished !</b>"
        }

      }else{
        couponCheck = "<b style='font-size:0.75rem;color: red'>Coupon not found</b>";
      }
      res.json({
        data: {
          couponCheck,
          discountPrice,
          discountPercentage,
          finalPrice,
        },
      });
    }

    }catch(error){
      
      console.log("error on coupon check :"+error)
  }

  }


exports.checkout = async (req, res) => {
  try {
    // console.log("adhhsdcnakjahinjkczm");
    let shippingAddress= await userCollection.aggregate([
      {
        $match:{_id: new mongoose.Types.ObjectId(req.session.userID)}
      },{
        $unwind:"$addresses"
      },{
        $match:{"addresses._id":new mongoose.Types.ObjectId(req.body.addressID)}
      }
    ]);
    shippingAddress = shippingAddress[0].addresses
    // console.log(shippingAddress)

    // Coupon used 

    const orderSummery = await cartCollection.aggregate([
      {
        $match:{customer:new mongoose.Types.ObjectId(req.session.userID)}
      },{
        $unwind:"$products"
      },{
        $project:{
          _id:0,
          product:"$products.name",
          quantity:"$products.quantity",
          totalPrice:"$products.price",
        }
      }
    ]);
    // console.log(orderSummery)

    const userCart=  await cartCollection.findOne({customer:req.session.userID});
    // console.log(cartCollection)

    //creating order details

    let orderDetails = {
      customer:req.session.userID,
      shippingAddress:{
        building: shippingAddress.building,
        address: shippingAddress.address,
        pincode: shippingAddress.pincode,
        country: shippingAddress.country,
        contactNumber: shippingAddress.contactNumber,
      },
      modeOfPayment:req.body.paymentMethod,
      summary:orderSummery,
      totalQuantity: userCart.totalQuantity,
      price: userCart.totalPrice,
      finalPrice: finalPrice,
      discountPrice: req.body.couponDiscount,
    };
    console.log(orderDetails)
    
    req.session.orderDetails=orderDetails;
    const transactionID = Math.floor(
      Math.random() * (1000000000000 - 10000000000) + 10000000000
    );
    req.session.transactionID=transactionID;

    if(req.body.paymentMethod==='COD'){
      res.redirect("/users/cart/checkout/" + transactionID);
    }
    else if(req.body.paymentMethod === "RazorPay"){
      console.log("here")

      const razorpay = new Razorpay({
        key_id: process.env.Rezorpay_Key_Id,
        key_secret: process.env.Rezorpay_Secret_key
    });
    const options = {
      amount: orderDetails.finalPrice*100,
      currency: 'INR',

  }
  razorpay.orders.create(options,(err,order)=>{
    order.transactionID=transactionID;
    order.key=process.env.Rezorpay_Key_Id;
    res.json(order)

  })
    }

  //   else if(req.body.paymentMethod === 'stripe') {
  //     // Create a PaymentIntent 
  //     stripe.customers.create({
  //       email:req.body.stripeEmail,
  //       source:req.body.stripeToken,
  //       name:'Krithy Books ',
  //       address:{
  //         building: shippingAddress.building,
  //         address: shippingAddress.address,
  //         pincode: shippingAddress.pincode,
  //         country: shippingAddress.country,
  //         contactNumber: shippingAddress.contactNumber,
  //       }

  //     })
  //     .then((customer) => {
  //       return stripe.charges.create({
  //         amount:orderDetails.finalPrice*100,
  //         currency:'USD',
  //         customer:customer.id
  //       })
  //     })
  //     .then((charge) => {
  //       console.log(charge)
  //       res.json({ clientSecret: paymentIntent.client_secret }); 

  //     }).catch((error) => {
  //       console.log('Error creating srtipe PaymentIntent:', error);
  //       res.status(500).send({ error: 'Failed to create PaymentIntent' });
  //     });
  // } 

  } catch (error) {
    console.log("checkout" + error)
  }
}

exports.result=async(req,res)=>{
  try{
    if(req.session.transactionID){
      const couponUsed=req.session.couponUsed;
      req.session.transactionID=false;
      const orderDetails= new orderCollection(req.session.orderDetails)
      await orderDetails.save();
      let currentUser=await userCollection.findById(req.session.userID)
      // console.log(currentUser.email)

      if(couponUsed){
        await userCollection.findByIdAndUpdate(req.session.userID,{
          $push:{
            orders:orderDetails._id,
            couponsUsed : couponUsed
          }
        })
        await couponCollection.findByIdAndUpdate(couponUsed,{
          $inc :{qty:-1}
        })
      }else{
        await userCollection.findByIdAndUpdate(req.session.userID,{
          $push:{
            orders:orderDetails._id
          }
        })
      }
      console.log(req.session.orderDetails.summary)
      req.session.orderDetails.summary.forEach(async(element) => {
        await productCollection.findByIdAndUpdate(element.product, 
          {$inc : {stock: -element.quantity}})
      });
      
      await cartCollection.findOneAndUpdate({
        customer:req.session.userID
      },{
        $set:{products: [], totalPrice: 0, totalQuantity: 0 }
      });
      // Transporter
     const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
          user:process.env.SMTP_MAIL,
          pass: process.env.SMTP_PASSWORD
      }
  });

    // Mail options
   // Mail options
const mailOptions = {
  from: process.env.SMTP_MAIL,
  to: currentUser.email,
  subject: "Order Confirmation | Krithy Books",
  html: `
  <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; width: 80%; margin: 0 auto;">
      <h1 style="color: #333;">Order Confirmation</h1>
      <h2>Dear ${currentUser.username},</h2>
      <p>Thank you for shopping with Krithy Books! Your order has been placed successfully.</p>
      <strong>Order ID:</strong> ${orderDetails._id}
      <hr>
      <h3>Shipping Address:</h3>
      <address>
          ${orderDetails.shippingAddress.building}<br>
          ${orderDetails.shippingAddress.address}<br>
          ${orderDetails.shippingAddress.pincode}<br>
          ${orderDetails.shippingAddress.country}<br>
          Contact: ${orderDetails.shippingAddress.contactNumber}
      </address>
      <hr>
      <h3>Order Summary:</h3>
      <ul>
      ${req.session.orderDetails.summary.map(product => `
          <li>
              <strong>${product.product}</strong><br>
              Quantity: ${product.quantity}<br>
              Price: $${product.totalPrice}
          </li>
      `).join('')}
      </ul>
      
      <h4>Total Price: $${orderDetails.price}</h4>
      <h4>Discount: $${orderDetails.discountPrice}</h4>
      <h3><strong>Final Price: $${orderDetails.finalPrice}</strong></h3>
      <p>We hope you enjoy your purchase! If you have any questions or concerns regarding your order, please don't hesitate to contact us.</p>
      <p>Warm Regards,<br>Krithy Books Team</p>
  </div>
  `
};



    // Send mail
     transporter.sendMail(mailOptions,(error,info)=>{
      if(error){
        console.log("mesaging sending error"+error);
      }else{
        console.log("message send to user email ");
      }
    });
      const orderResult = "Order Placed";
    res.render("user/profile/partials/orderResult", {
      documentTitle: orderResult,
      orderID: orderDetails._id,
      currentUrl: req.originalUrl,
      session:req.session.userID,

    });


    }else {
      res.redirect("/users/cart/checkout");
    }

  }catch(error){
    console.log("error on rendering success page :" +error)
  }
}

exports.offer=async(req,res)=>{
  try{
      const id=req.params.id;
      const userCart= await cartCollection.findOne({
        customer:req.session.userID
      });
      const cartPrice= userCart.totalPrice;

      const offer=await couponCollection.findById(id);
      if(offer){

             discountPercentage = offer.discount;
              discountPrice = (discountPercentage / 100) * cartPrice;
              discountPrice = Math.floor(discountPrice)
              finalPrice = cartPrice - discountPrice;

        res.json({
          data: {
            discountPrice,
            discountPercentage,
            finalPrice,
          },
        });

      }else{

        res.json({
          data: {
            discountPrice: 0,
            discountPercentage: 0,
            finalPrice: userCart.totalPrice,
          },
        });

      }

  }catch(error){
      console.log("eeror on chekcing offer :"+error)
  }
}