const mongoose = require('mongoose')
const productCollection = require('../../models/admin/products');
const categoryDetails =require('../../models/admin/category')
const authorsDetails =require('../../models/admin/author')
const sharp = require('sharp')

exports.viewProduts = async (req, res) => {

    try{
        const allCategories = await categoryDetails.find({});
        const allAuthors=await authorsDetails.find({});
        const allProducts= await productCollection.find().populate("category").populate("author")

        res.render("admin/partial/products", {
            categories: allCategories,
            products: allProducts,
            authors: allAuthors,
            sessionadmin: req.session.admin,
          })
    }
    catch(error){
        console.log("Product Page rendering error: " + error);
    }
}


exports.addProducts = async (req, res) => {
    try{
        let bookTitle = `${req.body.name}_bookTitle_${Date.now()}.png`;
        sharp(req.files.bookTitle[0].buffer)
          .toFormat("png")
          .png({quality:80})
          .toFile(`assets/img/books/${bookTitle}`);
        req.body.bookTitle=bookTitle;
        let thumbnail = `${req.body.name}_thumbnail_${Date.now()}.png`;
        sharp(req.files.thumbnail[0].buffer)
          .toFormat("png")
          .png({ quality: 80 })
          .toFile(`assets/img/books/${thumbnail}`);
        req.body.thumbnail = thumbnail;
        const imageArray=[];
        for (i = 0; i < 3; i++) {
            imageName = `${req.body.name}_image${i}_${Date.now()}.png`;
            sharp(req.files.images[i].buffer)
              .toFormat("png")
              .png({ quality: 80 })
              .toFile(`assets/img/books/${imageName}`);
            imageArray.push(imageName);
          }
          req.body.images = imageArray;
          req.body.category=new mongoose.Types.ObjectId(req.body.category);
          req.body.author= new mongoose.Types.ObjectId(req.body.author);
          const newProduct= new productCollection(req.body)
          await newProduct.save();
          console.log("Product added successfully");
          res.redirect("/admin/products");
 
    }
    catch(error){
        console.log("Product adding error: " + error);
    }

}



// 
    // try {
    //     let currentAdmin
    //      currentAdmin = adminuser.findOne(req.session.admin)
    //     res.render("admin/partial/products", {sessionadmin: req.session.admin})
    // } catch (error) {
    //     console.log("Error rendering admin signin Page: " + error);
    // }