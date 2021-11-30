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
        const newUser = new User({ 
            email: email,
            password: password,
            cart: { items: [] }
        });
        return newUser.save();
    })
    .then(result => {
        console.log("signup successful")
        res.redirect('/login');
    })
    .catch(err => console.log(err));
};
