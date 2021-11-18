const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('./admin/add-product', 
        { 
            pagetitle: "Add Product", 
            path: '/admin/add-product',
            activeAddProduct: true,
            formsCSS: true,
            productCSS: true
        });
}

exports.postAddProduct = (req, res, next) => {
    //retrieve data from form
    const title = req.body.title;
    const price = req.body.price;
    const image = req.body.image;
    const desc = req.body.description;
    //create and save new product
    const product = new Product(title, price, desc, image);
    product.save();
    res.redirect('/products');
}

exports.getProducts = (req, res, next) => {
    const products = Product.fetchAll((products) => {
        res.render('./admin/product-store', 
            { 
                products: products,
                pagetitle: 'Product Store (Admin)', 
                path: "/admin/product-store"          
            });
    });
}