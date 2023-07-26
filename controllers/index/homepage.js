// const userDTLS = require('../../models/user')

// exports.viewAll = async (req, res) => {
//     try {
//         let currentUser
//        currentUser=await userDTLS.findById(req.session.userID)
//         res.render('index/home', { message: "" , session:req.session.userID});
//     } catch (error) {
//         console.log("Error Occured"+error);
//     }
// }

const userDTLS = require('../../models/user')
const productCollection = require('../../models/admin/products')

exports.viewAll = async (req, res) => {
    try {
        let currentUser

        if(req.session.userID){
            currentUser=await userDTLS.findById(req.session.userID)
        }
        const allProducts=await productCollection.find({listed:true})
                                             .populate("category")
                                             .populate("author").sort({_id:-1})
       let newArrivals = allProducts.slice(0,6)
       let shortStory=[]
       let noval=[]
       let health=[]
       let memories=[]
       let humour=[]
       allProducts.forEach((product) => {
        if(product.category.name=="shortStory"){
            shortStory.push(product)
        } else if (product.category.name=="noval"){
            noval.push(product)
        }
        else if (product.category.name=="health"){
            health.push(product)
        }
        else if (product.category.name=="memories"){
            memories.push(product)
        }else {
            humour.push(product)
        }
       })


       shortStory=shortStory.slice(0,6)
       noval=noval.slice(0,6)
       health=health.slice(0,6)
       memories=memories.slice(0,6)

        res.render("index/home", {
          session: req.session.userID,
          currentUser,
          newArrivals,
          shortStory,
          noval,
          health,
          message:"",
          session:req.session.userID
        });
      
      } catch (error) {
        console.log("Error rendering landing page: " + error);
      }
    };
    
    exports.errorPage=(req,res)=>{
      res.render("index/404",{
        url:req.session.url
      })
        
    
    }