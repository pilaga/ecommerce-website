const bcrypt = require('bcryptjs');
const csrf = require('csurf');
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('./auth/login', 
    { 
        pagetitle: "Login",
        path: "/login",
        isAuthenticated: false
    });  
}

exports.getSignup = (req, res, next) => {
    res.render('./auth/signup', 
    { 
        pagetitle: "Signup",
        path: "/signup",
        isAuthenticated: false
    });  
}

exports.postLogin = (req, res, next) => {    
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({ email: email })
    .then(user => {
        if(!user) {
            console.log('error: user not found');
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
            res.redirect('/login');
        })
        .catch(err => {
            console.log(err);
            res.redirect('/login');
        })     
    })
    .catch(err => {
        console.log(err);
    });    
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
    //here - check user input
    //check email doesn't exit
    User.findOne({ email: email})
    .then(user => {
        if(user) {
            console.log("error: user already exists");
            return res.redirect('/signup');
        }
        return bcrypt.hash(password, 12)
        .then(hashedPassword => {
            const newUser = new User({ 
                email: email,
                password: hashedPassword,
                cart: { items: [] }
            });
            return newUser.save();
        })
        .then(result => {
            console.log("signup successful")
            res.redirect('/login');
        })
    })    
    .catch(err => console.log(err));
};
