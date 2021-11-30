exports.getLogin = (req, res, next) => {
    const isLoggedIn = req.session.isLoggedIn;
    res.render('./auth/login', 
    { 
        pagetitle: "Login",
        path: "/login",
        isAuthenticated: isLoggedIn
    });  
}

exports.postLogin = (req, res, next) => {
    req.session.isLoggedIn = true;
    console.log('login successful!');
    res.redirect('/');
}
