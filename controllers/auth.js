const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('./auth/login', 
    { 
        pagetitle: "Login",
        path: "/login",
        isAuthenticated: false
    });  
}

exports.postLogin = (req, res, next) => {    
    User.findById('61a55d2061b0b8551446df25')
    .then(user => {
        req.session.user = user;
        req.session.isLoggedIn = true;
        req.session.save(() => {
            res.redirect('/');
        });        
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
