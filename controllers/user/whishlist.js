const wishlistCollection = require("../../models/wishlist");
const productCollection = require("../../models/admin/products")
const userCollection = require('../../models/user')

exports.viewWishlist = async (req, res) => {
    try {
        userID = req.session.userID
        let currentUser = await userCollection.findById(userID)

        const userWishlist = await wishlistCollection
            .findOne({ customer: req.session.userID })
            .populate({ path: "products", populate: { path: "author" } })

        res.render("user/profile/partials/wishlist", {
            userWishlist,
            session: req.session.userID,
            currentUser,
            currentUrl: req.originalUrl
        });
    } catch (error) {
        res.redirect('/users/profile');
        console.log("error on rendering cart page:" + error)
    }
}

exports.addOrRemove = async (req, res) => {
    try {
        console.log('wish')
        const userWishlist = await wishlistCollection.findOne({
            customer: req.session.userID,
        }); 
        if (userWishlist) {
            const product = await productCollection.findById(req.body.id);
            const prodExist = await wishlistCollection.findOne({
                _id: userWishlist._id,
                products: req.body.id,
            });
            if (!prodExist) {
                console.log('wish2')

                await wishlistCollection.updateOne({
                    _id: userWishlist._id,
                }, {
                    $push: { products: req.body.id }
                });
                res.json({
                    data: {
                        added: 1,
                    },
                });
            } else {
                await wishlistCollection.updateOne({
                    _id: userWishlist._id,
                }, {
                    $pull: { products: req.body.id }
                });
                res.json({
                    data: {
                        added: 0,
                    },
                });

            }
        } else {
            res.json({
                data: {
                    added: null,
                },
            });
        }



    } catch (error) {

        console.log("error on adding or removing to cart:" + error);
        res.redirect('/');
    }
}

exports.remove = async (req, res) => {
    try {
        const userWishlist = await wishlistCollection.findOne({
            customer: req.session.userID,
        });
        await wishlistCollection.updateOne({
            _id: userWishlist._id,
        }, {
            $pull: { products: req.body.productID }
        });
        res.json({
            data: {
                deleted: 1,
            },
        });


    } catch (error) {
        res.redirect('/');
        console.log("error on removing wishlist product: " + error)
    }
}