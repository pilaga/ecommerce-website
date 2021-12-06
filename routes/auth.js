const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.get('/reset', authController.getReset);
router.get('/reset/:token', authController.getNewPassword)
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.post('/signup', 
    check('email').isEmail().withMessage('Email address is invalid')
    .custom((value, {req}) => {
        if(value === "test@test.com"){
            throw new Error ('This email address is forbidden');
        }
        return true;
    }), 
    authController.postSignup);
router.post('/reset', authController.postReset);
router.post('/new-password', authController.postNewPassword);

module.exports = router;