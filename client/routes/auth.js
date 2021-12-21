const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');
const User = require('../models/user');

router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.get('/reset', authController.getReset);
router.get('/reset/:token', authController.getNewPassword)
router.post('/login', 
    [
        check('email')
            .isEmail()
            .withMessage('Email address is invalid'),
        body('password', 'Password is invalid')
            .isLength({ min: 2 })        
            .isAlphanumeric()
            .trim()
    ],
    authController.postLogin);
router.post('/logout', authController.postLogout);
router.post('/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Email address is invalid')
            .custom((value, {req}) => {
                return User.findOne({ email: value})
                .then(user => {
                    if(user) {
                        return Promise.reject('User already exists, please use a different email address');
                    }
                });
            })
            .normalizeEmail(),
        body('password', 'Please enter a password with number/text and at least 5 characters')
            .isLength({ min: 5 })        
            .isAlphanumeric()
            .trim(),
        body('confirmPassword')
            .trim()
            .custom((value, { req }) => {
                if(value !== req.body.password) {
                    throw new Error('Passwords do not match!');
                }
                return true;
            })
    ],
    authController.postSignup);
router.post('/reset', authController.postReset);
router.post('/new-password', authController.postNewPassword);

module.exports = router;