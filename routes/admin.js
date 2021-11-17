const path = require('path');
const express = require('express');
const router = express.Router();

const rootDir = require('../utils/path_helper');

const products = [];

//admin/add-product => GET
router.get('/add-product', (req, res, next) => {
    res.render('add-product', 
    { 
        pagetitle: "Add Product", 
        path: '/admin/add-product',
        activeAddProduct: true,
        formsCSS: true,
        productCSS: true
     });
})

//admin/add-product => POST
router.post('/add-product', (req, res, next) => {
    products.push({title: req.body.title});
    res.redirect('/');
});

exports.routes = router;
exports.products = products;