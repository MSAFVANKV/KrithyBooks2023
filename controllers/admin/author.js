const authorsDetails = require('../../models/admin/author');


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

exports.addAuthor = async(req,res)=>{

    try{
        let inputAuthor=req.body.author
        inputAuthor=inputAuthor.toLowerCase();
        const authors= await authorsDetails.find({});
        const authorCheck= await authorsDetails.findOne({name:inputAuthor});
        if(authorCheck){
            res.render("admin/partial/authors", {
                details: authors,
              });
        }else{
            const newBrand= new authorsDetails({
                name:inputAuthor
            })
            await newBrand.save();
        res.redirect("/admin/authors");
        }

    }
    catch (error) {
        console.log("Error adding new brand: " + error);
      }
}

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
exports.editauthor=async(req,res) =>{
    try{
        const currentauthor=req.session.currentauthor;
        let newauthor=req.body.name;
        newauthor=newauthor.toLowerCase();
        const duplicateauthor= await authorsDetails.findOne({name:newauthor})
        if(duplicateauthor){
            res.render("admin/partial/editAuthor",{
                session:req.session.author,
                errorMessage: "This author Name Already Exist!",
                author: currentauthor,
            })

        }else{
            console.log(currentauthor);
            await authorsDetails.updateOne({_id:currentauthor._id},{$set:{name:newauthor}})
            res.redirect("/admin/authors")
        }

    }
    catch(error){
        console.log("Error POST edit brand Page: " + error);
    }
}