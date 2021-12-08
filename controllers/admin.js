const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('./admin/edit-product', 
        { 
            pagetitle: "Add Product", 
            path: '/admin/add-product',
            editing: false,
            isAuthenticated: req.session.isLoggedIn,
            hasErrors: false,
            errorMessage: "",
            validationErrors: [] 
        });
}

exports.postAddProduct = (req, res, next) => {
    //retrieve data from form
    const title = req.body.title;
    const price = req.body.price;
    const image = req.body.image;
    const desc = req.body.description;
    const userId = req.session.user._id;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).render('./admin/edit-product', 
        { 
            pagetitle: "Add Product", 
            path: '/admin/add-product',
            editing: false,
            isAuthenticated: req.session.isLoggedIn,
            hasErrors: true,
            product: {
                title: title,
                image: image,
                description: desc,
                price: price                
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array() 
        });
    }

    //create and save new product
    const product = new Product({
        title: title, 
        price: price, 
        description: desc, 
        image: image,
        userId: userId
    });
    product.save()
    .then(result => {
        res.redirect('/admin/product-store');
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.getProducts = (req, res, next) => {
    Product.find({ userId: req.user._id })
    .then(products => {
        res.render('./admin/product-store', 
            { 
                products: products,
                pagetitle: 'Product Store (Admin)', 
                path: "/admin/product-store",
                isAuthenticated: req.session.isLoggedIn      
            });
    })
    .catch(err => {
        console.log(err);
    })
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit; //always a string
    if(!editMode) {
        return res.redirect('/');
    }    
    const productId = req.params.productId; 
    Product.findById(productId)
    .then(product => {
        if(!product) {
            return res.redirect('/');
        }
        res.render('./admin/edit-product', 
            { 
                pagetitle: `Edit Product: ${product.title}`, 
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
                isAuthenticated: req.session.isLoggedIn,
                hasErrors: false,
                errorMessage: "",
                validationErrors: []
            });
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;
    const updatedtitle = req.body.title;
    const updatedprice = req.body.price;
    const updatedimage = req.body.image;
    const updateddesc = req.body.description;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).render('./admin/edit-product', 
        { 
            pagetitle: `Edit Product: ${updatedtitle}`, 
            path: '/admin/edit-product',
            editing: true,
            isAuthenticated: req.session.isLoggedIn,
            hasErrors: true,
            product: {
                title: updatedtitle,
                image: updatedimage,
                description: updateddesc,
                price: updatedprice,
                userId: req.body.userId,
                _id: req.body.productId
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array() 
        });
    }

    Product.findById(productId)
    .then(product => {
        if(product.userId.toString() !== req.user._id.toString()) {
            return res.redirect('/');
        } 
        product.title = updatedtitle;
        product.image = updatedimage;
        product.description = updateddesc;
        product.price = updatedprice;
        return product.save()
        .then(result => {
            console.log('updated product: ', productId);
            res.redirect('/admin/product-store'); 
        });
    })    
    .catch(err => {
        console.log(err);
    });
}

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;    
    Product.deleteOne({ _id: productId, userId: req.user._id })
    .then(() => {
        console.log('destroyed product:', productId);
        res.redirect('/admin/product-store');
    })
    .catch(err => {
        console.log(err);
    });   
}


