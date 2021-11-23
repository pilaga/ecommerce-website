const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');

//admin/add-product => GET
router.get('/add-product', adminController.getAddProduct);

//admin/add-product => POST
router.post('/add-product', adminController.postAddProduct);

//admin/product-store => POST
router.get('/product-store', adminController.getProducts);

router.get('/edit-product/:productId', adminController.getEditProduct);

module.exports = router;