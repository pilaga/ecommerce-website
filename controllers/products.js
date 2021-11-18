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
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
}

exports.getProducts = (req, res, next) => { 
    const products = Product.fetchAll((products) => {
        res.render('./shop/product-list', 
            { 
                products: products,
                pagetitle: 'My Shop', 
                path: "/", 
                hasProducts: products.length > 0, 
                activeShop: true,
                productCSS: true            
            });
    });    
}