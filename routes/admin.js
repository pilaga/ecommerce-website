const express = require('express');
const { check, body } = require('express-validator');
const router = express.Router();

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

router.get('/add-product', isAuth, adminController.getAddProduct);
router.post('/add-product', 
    [
        body('title', 'The title is invalid')
            .isString()
            .isLength({ min: 3 })
            .trim(),
        body('image', 'The image needs to be a valid URL')
            .isURL(),
        body('price', 'The price needs to be a valid number')
            .isFloat(),
        body('description', 'The description needs at least 5 characters')
            .isLength({ min: 5 })
            .trim()
    ],
    isAuth, adminController.postAddProduct);
router.get('/product-store', isAuth, adminController.getProducts);
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);
router.post('/edit-product', 
    [
        body('title', 'The title is invalid')
            .isString()
            .isLength({ min: 3 })
            .trim(),
        body('image', 'The image needs to be a valid URL')
            .isURL(),
        body('price', 'The price needs to be a valid number')
            .isFloat(),
        body('description', 'The description needs at least 5 characters')
            .isLength({ min: 5 })
            .trim()
    ],
    isAuth, adminController.postEditProduct);
router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;