const Product = require('../models/product');
const Order = require('../models/order');

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
    req.user.getCart()
    .then(cart => {
        return cart.getProducts()
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
    })    
    .catch(err => {
        console.log(err);
    });
} 

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    let fetchedCart;
    let newQuantity;
    req.user.getCart()
    .then(cart => {
        fetchedCart = cart;
        return cart.getProducts({ where: { id: productId }});
    })
    .then(products => {
        let product;
        if(products.length > 0) {
            product = products[0];
        }
        newQuantity = 1;
        if(product) {
            const oldQuantity = product.cartItem.quantity;
            newQuantity = oldQuantity + 1;
            return product;
        }        
        return Product.findByPk(productId);
    })
    .then(product => {
        return fetchedCart.addProduct(product,  {
            through: { quantity: newQuantity}
        });
    })
    .then(result => {
        res.redirect('/cart');
    })
    .catch(err => {
        console.log(err);
    });
}

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.user.getCart()
    .then(cart => {
        return cart.getProducts({ where: { id: productId }});
    })
    .then(products => {
        const product = products[0];
        return product.cartItem.destroy();
    })
    .then(result => {
        res.redirect('/cart');
    })
    .catch(err => console.log(err));
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

exports.postOrder = (req, res, next) => {
    req.user.getCart()
    .then(cart => {
        return cart.getProducts();
    })
    .then(products => {
        return req.user.createOrder()
        .then(order => {
            return order.addProducts(products.map(product => {
                product.orderItem = { quantity: product.cartItem.quantity };
                return product;
            }));
        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
}