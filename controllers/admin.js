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