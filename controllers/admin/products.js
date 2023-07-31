const mongoose = require('mongoose')
const productCollection = require('../../models/admin/products');
const categoryDetails =require('../../models/admin/category')
const authorsDetails =require('../../models/admin/author')
const sharp = require('sharp')

exports.viewProduts = async (req, res) => {

    try{
        const allCategories = await categoryDetails.find();
        const allAuthors=await authorsDetails.find();
        const allProducts= await productCollection.find().populate("category").populate("author")

        console.log(allProducts)
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

exports.editPage=async(req,res)=>{
  try{
      const currentProduct= await productCollection
      .findById(req.query.id)
      .populate("category")
      .populate("author")

      const categories=await categoryDetails.find({});
      const authors= await authorsDetails.find({});
      res.render("admin/partial/editProducts", {
          session: req.session.admin,
          product: currentProduct,
          authors:authors,
          categories: categories,
        });

  }
  catch(error){
      console.log("product editing page error"+error);
  }
}

exports.edit = async (req, res) => {
  try {
    if (JSON.stringify(req.files) !== "{}") {
      console.log("req.files", req.files);
      if (req.files.bookTitle) {
        let bookTitle = `${req.body.name}bookTitle${Date.now()}.png`;
        sharp(req.files.bookTitle[0].buffer)
          .toFormat("png")
          .png({ quality: 80 })
          .toFile(`assets/img/books/${bookTitle}`);
        req.body.bookTitle = bookTitle;
      }
      if (req.files.thumbnail) {
        let thumbnail = `${req.body.name}_thumbnail_${Date.now()}.png`;
        sharp(req.files.thumbnail[0].buffer)
          .toFormat("png")
          .png({ quality: 80 })
          .toFile(`assets/img/books/${thumbnail}`);
        req.body.thumbnail = thumbnail;
      }
      if (req.files.images) {
        const newArray = [];
        for (i = 0; i < 3; i++) {
          imageName = `${req.body.name}_image${i}_${Date.now()}.png`;
          sharp(req.files.images[i].buffer)
            .toFormat("png")
            .png({ quality: 80 })
            .toFile(`assets/img/books/${imageName}`);
          newArray.push(imageName);
        }
        req.body.images = newArray;
      }
    }
    req.body.category = new mongoose.Types.ObjectId(req.body.category);
    req.body.brand= new mongoose.Types.ObjectId(req.body.brand);
    await productCollection.findByIdAndUpdate(req.query.id, req.body);
    console.log("Product edited successfully");
    res.redirect("/admin/products");
  } catch (error) {
    console.log("Product editing POST error: " + error);
  }
};



exports.changeListing = async (req, res) => {
  try {
    const currentProduct = await productCollection.findById(req.query.id);
    let currentListing = currentProduct.listed;
    currentListing = ! currentListing
    await productCollection.findByIdAndUpdate(currentProduct._id, {
      listed: currentListing,
    });
    res.redirect("/admin/products");
  } catch (error) {
    console.log("Product listing changing error: " + error);
  }
};