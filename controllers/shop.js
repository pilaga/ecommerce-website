const fs = require('fs');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const PDFDocument = require('pdfkit');

const Product = require('../models/product');
const Order = require('../models/order');
const { encodeXText } = require('nodemailer/lib/shared');

const ITEMS_PER_PAGE = 2;

exports.getProducts = (req, res, next) => { 
    const page = +req.query.page || 1;
    let totalItems;

    Product.find().countDocuments()
    .then(count => {
        totalItems = count;
        return Product.find()
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);
    })    
    .then(products => {
        res.render('./shop/product-list', 
            { 
                products: products,
                pagetitle: 'Products List', 
                path: "/products",
                //pagination parameters:
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
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
    const page = +req.query.page || 1;
    let totalItems;

    Product.find().countDocuments()
    .then(count => {
        totalItems = count;
        return Product.find()
            .skip((page - 1) * ITEMS_PER_PAGE)
            .limit(ITEMS_PER_PAGE);
    })    
    .then(products => {
        res.render('./shop/index', 
            { 
                products: products,
                pagetitle: 'Shop', 
                path: "/",
                //pagination parameters:
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });  
}

exports.getCheckout = (req, res, next) => {
    let products;
    let total = 0;
    req.user.populate('cart.items.productId')
    .then(user => {
        products = user.cart.items;
        total = 0;
        products.forEach(p => {
            total += p.quantity * p.productId.price;
        });
        //get stripe session
        return stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: products.map(p => {
                return {
                    name: p.productId.title,
                    description: p.productId.description,
                    amount: p.productId.price * 100,
                    currency: 'usd',
                    quantity: p.quantity
                }
            }),
            success_url: req.protocol + '://' + req.get('host') + '/checkout/success',
            cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
        });        
    })
    .then(session => {
        res.render('./shop/checkout', 
        { 
            pagetitle: "Checkout",
            path: "/checkout",
            products: products,
            total: total,
            sessionId: session.id
        });
    }) 
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });  
};

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

exports.getCheckoutSuccess = (req, res, next) => {
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
    Order.findById(orderId).then(order => {
        if(!order){
            return next(new Error('No order found!'));
        }
        if(order.user.userId.toString() !== req.user._id.toString()) {
            return encodeXText(new Error('Download unauthorized'));
        }
        const filename = "invoice-" + orderId + ".pdf";
        const filepath = path.join('data', 'invoices', filename);

        const pdfDoc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="' + filename + '"');
        pdfDoc.pipe(fs.createWriteStream(filepath));
        pdfDoc.pipe(res);
        pdfDoc.fontSize(26).text('Invoice', {
            underline: true
        });
        pdfDoc.fontSize(14).text('---------------------------');
        let totalPrice = 0;
        order.items.forEach(item => {
            pdfDoc.text(item.product.title + ' - ' + item.quantity + ' x $' + item.product.price);
            totalPrice += item.quantity * item.product.price;
        });
        pdfDoc.text('---------------------------');
        pdfDoc.fontSize(20).text('Total price: $' + totalPrice);

        pdfDoc.end();

        //approach 1 - reading file data (not recommended)
        /*fs.readFile(filepath, (err, data) => {
            if(err) {
                return next(err);
            }
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'inline; filename="' + filename + '"');
            res.send(data);
        });*/

        //approach 2 - streaming file data (recommended)
        /*const file = fs.createReadStream(filepath);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="' + filename + '"');
        file.pipe(res);*/
    })
    .catch(err => next(err));
    
};