const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const fileHelper = require('../utils/file');
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
    const image = req.file;
    const desc = req.body.description;
    const userId = req.session.user._id;

    if(!image) {
        return res.status(422).render('./admin/edit-product', 
        { 
            pagetitle: "Add Product", 
            path: '/admin/add-product',
            editing: false,
            hasErrors: true,
            product: {
                title: title,
                description: desc,
                price: price                
            },
            errorMessage: 'Attached imge is not valid',
            validationErrors: []
        });
    }

    const imageUrl = image.path;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).render('./admin/edit-product', 
        { 
            pagetitle: "Add Product", 
            path: '/admin/add-product',
            editing: false,
            hasErrors: true,
            product: {
                title: title,
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
        image: imageUrl,
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
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
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
    const updatedimage = req.file;
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
        if(updatedimage) {  //only update image if file is provided
            fileHelper.deleteFile(product.image);
            product.image = updatedimage.path;
        }
        product.description = updateddesc;
        product.price = updatedprice;
        return product.save()
        .then(result => {
            console.log('updated product: ', productId);
            res.redirect('/admin/product-store'); 
        });
    })    
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.deleteProduct = (req, res, next) => {
    const productId = req.params.productId;    
    Product.findById(productId)
    .then(product => {
        if(!product) {
            return next(new Error('Product not found!'));
        }
        //delete image
        fileHelper.deleteFile(product.image);
        //delete product
        return Product.deleteOne({ _id: productId, userId: req.user._id });
    })
    .then(() => {
        console.log('destroyed product:', productId);
        res.status(200).json({
            message: "Success"
        });
    })
    .catch(err => {
        res.status(500).json({
            message: "Deleting product failed"
        });
    });   
}


