const express = require('express');
const adminLogin = require('../controllers/admin/login')
const dashboard = require('../controllers/admin/dashboard')
const logout = require('../controllers/admin/logout')
const sessionCheck = require('../middlewares/admin/sessionCheck')
const objectIdCheck = require('../middlewares/admin/objectIdCheck')
const orderViewAdmin = require('../controllers/admin/order')
const productsPage = require('../controllers/admin/products')
const upload = require('../utilities/imageUpload')
const categories = require('../controllers/admin/category')
// const create = require('../controllers/admin/signin')
const authors = require('../controllers/admin/author');
const customers=require("../controllers/admin/customer");
const coupons = require("../controllers/admin/coupon");
const router = express.Router();



router.
    route('/')
        .get(adminLogin.page)  
        .post(adminLogin.verification)
router.
   route('/dashboard')
        .get(sessionCheck,dashboard.viewAdmin)
        
router.
   route('/logout')
        .get(sessionCheck,logout.logout)
        
router.
        route('/order')
             .get(sessionCheck,orderViewAdmin.orderviewPage)

            //  product Page
router
        .get('/products', sessionCheck,productsPage.viewProduts)
        .post("/products/add_product",sessionCheck, upload.fields([
                { name: "bookTitle", maxCount: 1 },
                { name: "thumbnail", maxCount: 1 },
                { name: "images", maxCount: 2 },
              ]),productsPage.addProducts)

router.get("/products/edit",sessionCheck,productsPage.editPage);

router.post("/products/edit",sessionCheck,   
      upload.fields([
         { name: "bookTitle", maxCount: 1 },
         { name: "thumbnail", maxCount: 1 },
         { name: "images", maxCount: 3 },
]),productsPage.edit)


router.get(
   "/products/changeListing",sessionCheck, 
   productsPage.changeListing
 );
 

// CategoryMnanagement
router
   .route("/categories")
   .get(categories.list)
   .post( categories.addCategory);

router
   .route("/categories/delete_category")
   .get(sessionCheck,categories.deleteCategory);

router
   .route("/categories/edit")
   .get(sessionCheck,categories.editCategoryPage)
   .post(sessionCheck,categories.editCategory)


// authorMnanagement
router
   .route("/authors")
   .get(sessionCheck,authors.list)
   .post(sessionCheck, upload.fields([
      { name: "authorImg", maxCount: 1 },
    ]),authors.addAuthor);

router
   .route("/authors/delete_author")
   .get(sessionCheck,authors.deleteCategory);

router
   .route("/authors/edit")
   .get(sessionCheck,authors.editAthorPage)
   .post(sessionCheck,upload.fields([
      { name: "authorImg", maxCount: 1 },
    ]),authors.editauthor);

   router
   .route("/customers")
   .get(sessionCheck,customers.viewAll)
   .patch(sessionCheck,customers.changeAccess)

   router
   .route("/coupons")
   .get(sessionCheck,coupons.viewPage)
   .post(sessionCheck,coupons.addNew);
   router.get("/coupons/changeActivity",coupons.changeActivity);


        // create user for admin
// router.
//    route('/signup')
//    .get(create.Admin)
//         .post(create.createAdmin)
       


module.exports = router;