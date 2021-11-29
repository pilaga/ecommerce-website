const Product = require('../models/product');
//const Order = require('../models/order');

exports.getProducts = (req, res, next) => { 
    Product.fetchAll()
    .then(products => {
        res.render('./shop/product-list', 
            { 
                products: products,
                pagetitle: 'Product List', 
                path: "/products"         
            });
    })
    .catch(err => {
        console.log(err);
    });
}

exports.getProduct = (req, res, next) => {
    Product.fetchById(req.params.productId)
    .then((product) => {
        res.render('./shop/product-details',
        {
            product: product,
            pagetitle: `Product informations: ${product.title}`,
            path: "/products"
        })  
    })
    .catch(err => {
        console.log(err);
    });
    
}

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
    .then(products => {
        res.render('./shop/index', 
            { 
                products: products,
                pagetitle: 'Shop', 
                path: "/"         
            });
    })
    .catch(err => {
        console.log(err);
    });
}


exports.getCart = (req, res, next) => {
    req.user.getCart()
    .then(products => {
        res.render('./shop/cart', 
            { 
                pagetitle: "My Cart",
                path: "/cart",
                products: products
            });
    })    
    .catch(err => {
        console.log(err);
    });
}

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.fetchById(productId)
    .then(product => {
        return req.user.addItemToCart(product);
    })
    .then(result => {
        //console.log(result);
        res.redirect('/cart');
    })
    .catch(err => console.log(err));
}


exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.user.removeItemFromCart(productId)
    .then(result => {
        res.redirect('/cart');
    })
    .catch(err => console.log(err));
}

exports.getOrders = (req, res, next) => {
    req.user.getOrders()
    .then(orders => {
        res.render('./shop/orders', 
        { 
            pagetitle: "My Orders",
            path: "/orders",
            orders: orders
        });
    })
    .catch(err => console.log(err));    
}

/*
exports.getCheckout = (req, res, next) => {
    res.render('./shop/checkout', 
        { 
            pagetitle: "Checkout",
            path: "/checkout"
        });
}*/

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user.addOrder()
    .then(result => {
        res.redirect('/orders');
    })
    .catch(err => console.log(err));
}