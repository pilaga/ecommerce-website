const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');

router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.get('/reset', authController.getReset);
router.get('/reset/:token', authController.getNewPassword)
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.post('/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Email address is invalid')
            .custom((value, {req}) => {
                if(value === "test@test.com"){
                    throw new Error ('This email address is forbidden');
                }
                return true;
            }),
        body('password', 'Please enter a password with number/text and at least 5 characters')
            .isLength({ min: 5 })        
            .isAlphanumeric(),
        body('confirmPassword').custom((value, { req }) => {
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