const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => { 
    Product.findAll()
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
    Product.findByPk(req.params.productId)
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
    
    //alternative with WHERE condition
    /*Product.findAll({ where: { id: req.params.productId }})
    .then((products) => {
        res.render('./shop/product-details',
        {
            product: products[0],
            pagetitle: `Product informations: ${products[0].title}`,
            path: "/products"
        })  
    })
    .catch(err => {
        console.log(err);
    });*/
}

exports.getIndex = (req, res, next) => {
    Product.findAll()
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

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, product => {
        Cart.deleteProduct(productId, product.price);
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