const { default: mongoose } = require("mongoose");
const cartCollection=require("../../models/cart");
const userCollection=require("../../models/user");
const couponCollection=require("../../models/admin/coupons");
const productCollection = require('../../models/admin/products')
const orderCollection = require("../../models/order")


exports.directCheckout = async(req, res) => {
    try {
        
        const stock = req.query.stock;
        const productId = req.query.id;

        // const product = await productCollection.findOne(productId)
        const product = await productCollection.findOne({ _id: new mongoose.Types.ObjectId(productId) });
        req.session.productId = productId

        // console.log(productId)

        if (!product) {
            console.log('Error in directCheckout: Product not found.');
            return res.redirect('/');
        }
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
        // Render the checkout page directly with the product details
        res.render("user/profile/partials/buyNow", {
            productDetails: product,
            session: req.session.userID,
            documentTitle: "Krithy Books - Direct Checkout",
            defaultAddress,
            coupons,
            allAddresses,
            currentUrl: req.originalUrl
        });

    } catch (error) {
        console.log('Error in directCheckout: ' + error);
        res.redirect('/');
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
        res.redirect("/users/directCheckout/" + transactionID);
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
        res.redirect("/users/directCheckout");
      }
  
    }catch(error){
      console.log("error on rendering success page :" +error)
    }
  }
  
exports.defaultAddress=async(req,res)=>{
    try{
console.log("ffffsjj")
        const userID = req.session.userID;
    const DefaultAddress = req.body.DefaultAddress;
    await userCollection.updateMany(
      { _id: userID, "addresses.primary": true },
      { $set: { "addresses.$.primary": false } }
    );
    await userCollection.updateOne(
      { _id: userID, "addresses._id": DefaultAddress },
      { $set: { "addresses.$.primary": true } }
    );

        res.redirect("/users/directCheckout");

    }catch(error){
        
        res.redirect("/users/directCheckout");
        console.log("error on changing to deafultaddress :"+error)

    }
}


exports.applySingleProductCoupon = async(req, res) => {
    try {
        const couponCode = req.body.couponCode;
        const productPrice = parseFloat(req.body.productPrice);

        const coupon = await couponCollection.findOne({ code: couponCode });

        if(!coupon) {
            return res.json({
                data: {
                    couponCheck: 'Invalid Coupon',
                    discountPrice: 0,
                    finalPrice: productPrice
                }
            });
        }

        const discount = productPrice * (coupon.discount / 100);
        const finalPrice = productPrice - discount;

        return res.json({
            data: {
                couponCheck: 'Coupon Applied Successfully',
                discountPrice: discount.toFixed(2),
                finalPrice: finalPrice.toFixed(2)
            }
        });

    } catch (error) {
        console.log('Error in applySingleProductCoupon: ' + error);
        return res.redirect('/');
    }
}


