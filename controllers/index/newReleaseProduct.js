
const userDTLS = require('../../models/user')
const productCollection = require('../../models/admin/products')
const categoryCollection=require("../../models/admin/category");

exports.ourCollection = async (req, res) => {
    try {
        let collectionId = req.query.category;
        let listing = req.session.listing;
        let listingName
        let currentUser=null;
        let prodtDetail
        if (req.session.userID) {
            currentUser=await userDTLS.findOne({customer:req.session.userID})
        } if(!req.session.listingName){
            listingName="Our Collection"
        } if(req.session.listingName){
            listingName=req.session.listingName
        }
          if(collectionId=='collection' && !req.session.sorted && !req.session.filter && !req.session.searched){
            listing= await productCollection.find({listed:true}).populate("author").limit(12);
            req.session.listing=listing;
            listingName="Our Collection"
        }
          else if(collectionId=='moreCollection' && !req.session.sorted && !req.session.filter && !req.session.searched){
            listing= await productCollection.find({listed:true}).populate("brand");
            req.session.listing=listing;
            listingName="Our Collection"
          }
            req.session.sorted=null;
            req.session.filter=null;
            req.session.searched=null;

            res.render('index/newReleasePage', {
                 message: "" , 
                 session:req.session.userID,
                 listingName,
                 listing,
                 currentUser,
                });
    } catch (error) {
        res.redirect('/products')
        console.log("error while getting new product page"+error);
    }
}

exports.filter = async (req, res) => {
    try {
        let allProducts = await productCollection.find({listed:true}).populate("category").populate("author");
        let currentFilter 
        let searchClear
        switch (req.body.filterBy) {
            case "short Stories":
                currentFilter = allProducts.filter(
                    (product) => product.category == "short Stories"
                  );
                  req.session.listingName="short Stories";
                  break;
                  case 'Noval': 
                  currentFilter = allProducts.filter(
                   (product) => product.category == "Noval"
                 );
                 req.session.listingName="Novals";
                 break;
             case 'Health': 
                     currentFilter = allProducts.filter(
                     (product) => product.category == "Health"
                   );
                   req.session.listingName="Healths";
                   break;
             case "none":
                     currentFilter = allProducts.slice(0,9);
                     searchClear=1;
                     break;
             default :
                     currentFilter = null;
                     console.log("default switch case of filter");
                     
         }
         req.session.listing = currentFilter;
         req.session.filtered = currentFilter;
         req.session.filter = 1;
         req.session.categorySort=null;
            req.session.sortBy=null;
        if (!currentFilter && !searchClear) {
            res.json({
              success: 0,
            });
          } else if( searchClear) {
            res.json({
              success: "clear",
            });}
            else {
                res.json({
                    success: 1,
                  });
            }
    
    } catch (error) {
        res.redirect('/products')
        console.log("Error on filtering: " + error);
    }
}



exports.sortBy = async (req, res) => {
    try{
        if(!req.session.listing){
            req.session.listing=await productCollection.find({listed:true}).populate("brand")
        }
        let listing=req.session.listing;
        if(req.body.sortBy==='ascending'){
        
            listing= listing.sort((a,b)=> a.price-b.price );
            req.session.listing=listing;
            req.session.sorted = 1;
            res.json({
                sorted:1
              });
        }
        else if(req.body.sortBy==='descending'){
           
            listing=listing.sort((a,b)=> b.price-a.price );
            req.session.listing=listing;
            req.session.sorted = 1;
            res.json({
                sorted:1
              });
        }
        else if(req.body.sortBy==='newReleases'){
            listing=listing.sort((a,b)=> {
                const id1 = a._id.toString();
                const id2 = b._id.toString();
                if (id1 < id2) {
                return 1;
                  }
                if (id1 > id2) {
                 return -1;
                  }
                return 0;
            } );
            req.session.listing=listing;
            req.session.sorted = 1;
            res.json({
                sorted:1
              });

        }
        req.session.categorySort=null;
        req.session.filtered=null;
        req.session.sortBy = listing
    

    }catch(error){
        res.redirect('/products')
        console.log("Error on sorting: " + error); 
    }
}




exports.categories=async(req,res)=>{
    try{
  let category=req.query.category;
  let listing;
  let currentUser=null;
  let  userCart=null;
  let currentCategory;

  if(req.session.userID){
    currentUser= await userDTLS.findOne({_id:req.session.userID})
  }

    if (category== "newReleases") {
      
        listing = await productCollection.find().sort({ _id: -1 });
      
      res.render("index/newReleasePage", {
        listing: listing,
        documentTitle: `New Releases | SHOE ZONE`, 
        listingName: "New Releases",
        session:req.session.userID,
        userCart,
        currentUser
      });
    } else {
      if(!req.session.searched){
         currentCategory = await categoryCollection.find({name:category});
        listing = await productCollection.find({
          category: currentCategory[0]._id,
          listed: true,
        }).populate('author')
        req.session.listing=listing;
        req.session.categorySort=listing;
      }
      
        req.session.sortBy=null;
        req.session.filtered=null;
        console.log(currentCategory[0].name)
      
      res.render("index/newReleasePage", {
        listing: req.session.listing,
        documentTitle: `${currentCategory[0].name} | KRITHY BOOKS`,
        listingName: currentCategory[0].name,
        session:req.session.userID,
        currentUser,
        userCart
      });
    }
    }
    catch(error){
        res.redirect('/newReleaseProduct')
        console.log("Error categorizing in products page: " + error);
    }
}


exports.search=async(req,res)=>{
    try{
        let searchResult=[];
        let searchInput=req.body.searchInput;
        if(req.session.filtered ){
          console.log('1')
            const regex=new RegExp(searchInput,'i');
            req.session.filtered.forEach(element => {
                if(regex.exec(element.name)){
                    searchResult.push(element);
                }
            });
        }
       else if(req.session.sortBy){
        console.log('2')
          const regex=new RegExp(searchInput,'i');
          req.session.sortBy.forEach(element => {
              if(regex.exec(element.name)){
                  searchResult.push(element);
              }
          });
      }
      else if(req.session.categorySort){
        console.log('3')
        const regex=new RegExp(searchInput,'i');
        req.session.categorySort.forEach(element => {
            if(regex.exec(element.name)){
              console.log('ggg')
                searchResult.push(element);
            }
        });
    }
      else{
            searchResult=await productCollection.find({
                name:{$regex:searchInput,$options:'i'},listed:true
            })
        }
        req.session.searched=1
       
        console.log(searchResult)
        req.session.listing=searchResult;
        res.json({
            success: 1,
          });

    }catch(error){
        res.redirect('/newReleaseProduct')
        console.log("Error on searching: " + error); 
    }
}
