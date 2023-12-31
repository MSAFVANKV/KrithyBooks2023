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
const managers = require('../controllers/admin/managers')
const authors = require('../controllers/admin/author');
const customers=require("../controllers/admin/customer");
const coupons = require("../controllers/admin/coupon");
const salesReport = require("../controllers/admin/salesReport");
const offer = require("../controllers/admin/offer")
const router = express.Router();



router.
    route('/')
        .get(adminLogin.page)  
        .post(adminLogin.verification)
router.
   route('/dashboard')
        .get(sessionCheck,dashboard.viewAdmin)
        .put(sessionCheck,dashboard.chartData)

router
        .route("/salesReport")
        .post(sessionCheck,salesReport.download);
     

   router.get("/chart/:id",dashboard.customChartData)
        
router.
   route('/logout')
        .get(sessionCheck,logout.logout)
        
router.
        route('/order')
            .get(sessionCheck,orderViewAdmin.orderviewPage)
            .patch(sessionCheck, orderViewAdmin.deliver)
            .put(sessionCheck, orderViewAdmin.return)

            
router
.route("/order/:id")
.get(sessionCheck,objectIdCheck, orderViewAdmin.detailsPage)
.patch(sessionCheck, objectIdCheck, orderViewAdmin.cancel)


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

   router
    .route("/offers")
    .get(sessionCheck,offer.viewPage)
    .post(sessionCheck,offer.addNew)
router.get("/offers/delete",offer.delete);

        // create user for admin
router.
   route('/manager')
   .get(sessionCheck,managers.Admin)
   .post(sessionCheck,managers.verification)

   router
   .route('/manager/confirm')
   .post(sessionCheck,managers.createAdmin)
       


module.exports = router;