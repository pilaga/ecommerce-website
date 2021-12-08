const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');
const csrf = require('csurf');
const User = require('../models/user');

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}));

exports.getLogin = (req, res, next) => {
    res.render('./auth/login', 
    { 
        pagetitle: "Login",
        path: "/login",
        errorMessage: req.flash('error'),
        userInput: {
            email: "",
            password: ""
        },
        validationErrors: [] 
    });  
}

exports.getReset = (req, res, next) => {
    res.render('./auth/reset', 
    { 
        pagetitle: "Reset Password",
        path: "/reset",
        errorMessage: req.flash('error')
    });  
}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({ resetToken: token, resetTokenExpiration: {$gt: Date.now()} }) //$gt - greater than
    .then(user => {
        res.render('./auth/new-password', 
        { 
            pagetitle: "Reset Password",
            path: "/new-password",
            errorMessage: req.flash('error'),
            userId: user._id.toString(),
            token: token
        });  
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });    
}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const token = req.body.token;
    let resetUser;

    User.findOne({ 
        _id: userId, 
        resetToken: token, 
        resetTokenExpiration: { $gt: Date.now() } 
    })
    .then(user => {
        resetUser = user;
        return bcrypt.hash(newPassword, 12);
    })
    .then(hashedPwd => {
        resetUser.password = hashedPwd;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
    })
    .then(result => {
        res.redirect('/login');
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });  
}

exports.getSignup = (req, res, next) => {
    res.render('./auth/signup', 
    { 
        pagetitle: "Signup",
        path: "/signup",
        errorMessage: req.flash('error'),
        userInput: {
            email: "",
            password: "",
            confirmPassword: ""
        },
        validationErrors: [] 
    });  
}

exports.postLogin = (req, res, next) => {    
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).render('./auth/login', 
        { 
            pagetitle: "Login",
            path: "/login",
            errorMessage: errors.array()[0].msg,
            userInput: {
                email: email,
                password: password
            },
            validationErrors: errors.array() 
        });    
    }

    User.findOne({ email: email })
    .then(user => {
        if(!user) {
            req.flash('error', 'Invalid email or password');
            return res.redirect('/login');
        }
        bcrypt.compare(password, user.password)
        .then(matchResult => {
            if(matchResult) {
                req.session.isLoggedIn = true;
                req.session.user = user;
                return req.session.save(() => {
                    res.redirect('/');
                });   
            }
            req.flash('error', 'Invalid email or password');
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
            req.flash('error', 'Invalid email or password');
            res.redirect('/login');
        })     
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });    
}

exports.postReset = (req, res, next) => {    
    crypto.randomBytes(32, (error, buffer) => {
        if(error) {
            console.log(err);
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({ email: req.body.email })
        .then(user=> {
            if(!user) {
                req.flash('error', 'No account with that email found');
                return res.redirect('/reset');
            }
            console.log('token: ' + token);
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000;
            return user.save();
        })
        .then(result => {
            
            return transporter.sendMail({
                to: req.body.email,
                from: 'pierre.lagadec@gmail.com',
                subject: 'Password Reset',
                html: `
                <p>You requested password reset!</p>
                <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password</p>
                `
            });  
        })
        .catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });  
    })
}

exports.postLogout = (req, res, next) => {    
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    }); 
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(422).render('./auth/signup', 
        { 
            pagetitle: "Signup",
            path: "/signup",
            errorMessage: errors.array()[0].msg,
            userInput: {
                email: email,
                password: password,
                confirmPassword: req.body.confirmPassword
            },
            validationErrors: errors.array()
        });  
    }

    //here - check user input
    //check email doesn't exit
    bcrypt.hash(password, 12)
    .then(hashedPassword => {
        const newUser = new User({ 
            email: email,
            password: hashedPassword,
            cart: { items: [] }
        });
        return newUser.save();
    })
    .then(result => {            
        res.redirect('/login');            
        return transporter.sendMail({
            to: email,
            from: 'pierre.lagadec@gmail.com',
            subject: 'Signup successful!',
            html: '<h3>You are signed up!</h3><p>Welcome to the website :)</p>'
        });            
    })
    .catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });  
};
