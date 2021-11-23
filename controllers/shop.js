const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => { 
    const products = Product.fetchAll((products) => {
        res.render('./shop/product-list', 
            { 
                products: products,
                pagetitle: 'Product List', 
                path: "/products"          
            });
    });    
}

exports.getProduct = (req, res, next) => {
    Product.findById(req.params.productId, product => {
        res.render('./shop/product-details',
            {
                product: product,
                pagetitle: `Product informations: ${product.title}`,
                path: "/products"
            })      
    });     
}

exports.getIndex = (req, res, next) => {
    const products = Product.fetchAll((products) => {
        res.render('./shop/index', 
            { 
                products: products,
                pagetitle: 'Shop', 
                path: "/"         
            });
    });  
}

exports.getCart = (req, res, next) => {
    Cart.getCart((cart) => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for(product of products) {
                const cartProduct = cart.products.find(item => item.id === product.id);
                if(cartProduct) {
                    cartProducts.push({ product: product, quantity: cartProduct.quantity });
                }
            }
            res.render('./shop/cart', 
            { 
                pagetitle: "My Cart",
                path: "/cart",
                products: cartProducts
            });
        });        
    });
}
   

exports.postCart = (req, res, next) => {
    Product.findById(req.body.productId, (product) => {
        Cart.addProduct(product.id, product.price);
        res.redirect('/cart');
    });    
}

exports.getOrders = (req, res, next) => {
    res.render('./shop/orders', 
        { 
            pagetitle: "My Orders",
            path: "/orders"
        });
}

exports.getCheckout = (req, res, next) => {
    res.render('./shop/checkout', 
        { 
            pagetitle: "Checkout",
            path: "/checkout"
        });
}