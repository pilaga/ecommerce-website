const path = require('path');
const express = require('express');
const router = express.Router();

const adminData = require('./admin');
const rootDir = require('../utils/path_helper');

router.get('/', (req, res, next) => { 
    console.log(adminData.products);
    //res.sendFile(path.join(rootDir, 'views', 'shop.html'));
    res.render('shop'); //no need .pug because we set pug as default
});

module.exports = router;