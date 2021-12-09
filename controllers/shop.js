const fs = require('fs');
const path = require('path');
const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => { 
    Product.find()
    .then(products => {
        res.render('./shop/product-list', 
            { 
                products: products,
                pagetitle: 'Product List', 
                path: "/products" 
            });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });  
}

exports.getProduct = (req, res, next) => {
    Product.findById(req.params.productId)
    .then((product) => {
        res.render('./shop/product-details',
        {
            product: product,
            pagetitle: `Product informations: ${product.title}`,
            path: "/products"
        })  
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });     
}

exports.getIndex = (req, res, next) => {
    Product.find()
    .then(products => {
        res.render('./shop/index', 
            { 
                products: products,
                pagetitle: 'Shop', 
                path: "/"
            });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });  
}

exports.getCart = (req, res, next) => {
    req.user.populate('cart.items.productId')
    .then(user => {
        const products = user.cart.items;
        res.render('./shop/cart', 
            { 
                pagetitle: "My Cart",
                path: "/cart",
                products: products
            });
    })    
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });  
}

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId)
    .then(product => {
        return req.user.addItemToCart(product);
    })
    .then(result => {
        res.redirect('/cart');
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });  
}

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.user.removeItemFromCart(productId)
    .then(result => {
        res.redirect('/cart');
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });  
}

exports.getOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.session.user._id })
    .then(orders => {
        res.render('./shop/orders', 
        { 
            pagetitle: "My Orders",
            path: "/orders",
            orders: orders
        });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });      
}

exports.postOrder = (req, res, next) => {
    req.user.populate('cart.items.productId')
    .then(user => {
        const items = user.cart.items.map(i => {
            return { 
                quantity: i.quantity,
                product: {...i.productId._doc}
            };
        });
        const order = new Order({
            user: {
                email: req.user.email,
                userId: req.user
            },
            items: items
        });
        return order.save()
    })
    .then(result => {
        return req.user.clearCart();
    })
    .then(result => {
        res.redirect('/orders');
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });  
}

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    const filename = "invoice-" + orderId + ".pdf";
    const filepath = path.join('data', 'invoices', filename);
    //console.log("filepath: " + filepath);
    fs.readFile(filepath, (err, data) => {
        if(err) {
            return next(err);
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="' + filename + '"');
        res.send(data);
    });
};