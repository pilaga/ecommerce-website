const path = require('path');
const express = require('express');
const router = express.Router();

const adminData = require('./admin');
const rootDir = require('../utils/path_helper');

router.get('/', (req, res, next) => { 
    //console.log(adminData.products);
    //res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    const products = adminData.products;
    res.render('shop', { pagetitle: 'My Shop', path: "/", products: products }); //no need .pug because we set pug as default
});

module.exports = router;