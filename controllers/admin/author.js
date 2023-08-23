const authorsDetails = require('../../models/admin/author');
const sharp=require("sharp")

exports.list= async(req,res)=>{

    try {
        const authors = await authorsDetails.find({});
        res.render("admin/partial/authors", {
        sessionadmin: req.session.admin,
        details: authors,
        });
      } catch (error) {
        console.log("Error rendering all brands: " + error);
      }

}

// exports.addAuthor = async(req,res)=>{

//     try{    
//         let inputAuthor=req.body.author
//         inputAuthor=inputAuthor.toLowerCase();
//         // img
//         let authorImges = `${req.body.name}_authorImg_${Date.now()}.png`;
//         sharp(req.files.authorImg[0].buffer)
//           .toFormat("png")
//           .png({quality:80})
//           .toFile(`assets/img/authors/${authorImg}`);
//         req.body.authorImg=authorImg;
//         // 
//         const authors= await authorsDetails.find({});
//         const authorCheck= await authorsDetails.findOne({name:inputAuthor});
//         if(authorCheck){
//             res.render("admin/partial/authors", {
//                 details: authors,
//               });
//         }else{
//             const newAuthor= new authorsDetails({
//                 name:inputAuthor,
//                 authorImg:authorImges
//             })
//             await newAuthor.save();
//         res.redirect("/admin/authors");
//         }

//     }
//     catch (error) {
//         console.log("Error adding new Author: " + error);
//       }
// }

exports.addAuthor = async(req, res) => {
    try {
        let inputAuthor = req.body.author;
        inputAuthor = inputAuthor.toLowerCase();
        
        // Image processing
        let authorImges = `${inputAuthor}_authorImg_${Date.now()}.png`;
        await sharp(req.files.authorImg[0].buffer)
            .toFormat("png")
            .png({ quality: 80 })
            .toFile(`assets/img/authors/${authorImges}`);
        
        const authorCheck = await authorsDetails.findOne({ name: inputAuthor });
        
        if (authorCheck) {
            const authors = await authorsDetails.find({});
            res.render("admin/partial/authors", {
                details: authors,
            });
        } else {
            const newAuthor = new authorsDetails({
                name: inputAuthor,
                authorImg: authorImges
            });
            await newAuthor.save();
            res.redirect("/admin/authors");
        }
    } catch (error) {
        console.log("Error adding new Author: " + error);
    }
};


exports.deleteCategory= async(req,res)=>{
    try{
        const authorId = req.query.id;
        const deleteBrand = await authorsDetails.deleteOne({_id:authorId});
        res.redirect("/admin/authors");
    }
    catch(error){
        console.log("Error deleting brand: " + error)
    }
}

exports.editAthorPage= async(req,res)=>{
    try{
        const authorId = req.query.id;
        const currentauthor= await authorsDetails.findOne({_id:authorId});
        req.session.currentauthor = currentauthor;
        res.render("admin/partial/editAuthor",{
            session:req.session.admin,
            documentTitle: "Edit Author | SHOE ZONE",
            author: currentauthor,
        })
       
    }
    catch(error){
        console.log("Error GET Author Page: " + error)
    }
}
exports.editauthor = async(req, res) => {
    try {
        const currentauthor = req.session.currentauthor;
        let newauthor = req.body.name;
        newauthor = newauthor.toLowerCase();

        const duplicateauthor = await authorsDetails.findOne({ name: newauthor });

        // Check for name conflict: the new name should not be in use by others except the current author
        if (duplicateauthor && String(duplicateauthor._id) !== String(currentauthor._id)) {
            res.render("admin/partial/editAuthor", {
                session: req.session.author,
                errorMessage: "This author Name Already Exists!",
                author: currentauthor,
            });
            return;
        }

        let authorImgPath = currentauthor.authorImg;  // default to the old image

        // If a new image was uploaded
        if (req.files && req.files.authorImg) {
            let authorImges = `${newauthor}_authorImg_${Date.now()}.png`;
            await sharp(req.files.authorImg[0].buffer)
                .toFormat("png")
                .png({ quality: 80 })
                .toFile(`assets/img/authors/${authorImges}`);
            authorImgPath = authorImges;
        }

        await authorsDetails.updateOne(
            { _id: currentauthor._id },
            { $set: { name: newauthor, authorImg: authorImgPath } }
        );

        res.redirect("/admin/authors");

    } catch (error) {
        console.log("Error POST edit author Page: " + error);
        res.status(500).send('Internal Server Error');
    }
};


// const authorsDetails = require('../../models/admin/author');
// const sharp = require('sharp')


// exports.list= async(req,res)=>{

//     try {
//         const authors = await authorsDetails.find({});
//         res.render("admin/partial/authors", {
//         sessionadmin: req.session.admin,
//         details: authors,
//         });
//       } catch (error) {
//         console.log("Error rendering all Authors: " + error);
//       }

// }

// exports.addAuthor = async(req,res)=>{

//     try{
//         let inputAuthor=req.body.author
//         inputAuthor=inputAuthor.toLowerCase();
//         let thumbnailauthor = `${req.body.name}_thumbnailauthor_${Date.now()}.png`;
//         sharp(req.files.thumbnailauthor[0].buffer)
//           .toFormat("png")
//           .png({quality:80})
//           .toFile(`assets/img/authors/${thumbnailauthor}`);
//           req.body.bookTitle=bookTitle;
//         const authors= await authorsDetails.find({});
//         const authorCheck= await authorsDetails.findOne({name:inputAuthor});
//         if(authorCheck){
//             res.render("admin/partial/authors", {
//                 details: authors,
//               });
//         }else{
//             req.body.author= new mongoose.Types.ObjectId(req.body.author);
//             const newBrand= new authorsDetails({
//                 name:inputAuthor,
//                 thumbnailauthor:authors
//             })
//             await newBrand.save();
//         res.redirect("/admin/authors");
//         }

//     }
//     catch (error) {
//         console.log("Error adding new author: " + error);
//       }
// }

// exports.deleteCategory= async(req,res)=>{
//     try{
//         const authorId = req.query.id;
//         const deleteBrand = await authorsDetails.deleteOne({_id:authorId});
//         res.redirect("/admin/authors");
//     }
//     catch(error){
//         console.log("Error deleting brand: " + error)
//     }
// }

// exports.editAthorPage= async(req,res)=>{
//     try{
//         const authorId = req.query.id;
//         const currentauthor= await authorsDetails.findOne({_id:authorId});
//         req.session.currentauthor = currentauthor;
//         res.render("admin/partial/editAuthor",{
//             session:req.session.admin,
//             author: currentauthor,
//         })
       
//     }
//     catch(error){
//         console.log("Error GET Author Page: " + error)
//     }
// }
// exports.editauthor=async(req,res) =>{
//     try{
//         const currentauthor=req.session.currentauthor;
//         let newauthor=req.body.name;
//         newauthor=newauthor.toLowerCase();
//         const duplicateauthor= await authorsDetails.findOne({name:newauthor})
//         if(duplicateauthor){
//             res.render("admin/partial/editAuthor",{
//                 session:req.session.author,
//                 errorMessage: "This author Name Already Exist!",
//                 author: currentauthor,
//             })

//         }else{
//             console.log(currentauthor);
//             await authorsDetails.updateOne({_id:currentauthor._id},{$set:{name:newauthor}})
//             res.redirect("/admin/authors")
//         }

//     }
//     catch(error){
//         console.log("Error POST edit brand Page: " + error);
//     }
// }