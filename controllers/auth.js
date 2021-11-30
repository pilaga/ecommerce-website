exports.getLogin = (req, res, next) => {
    //console.log(req.get('Cookie'));
    const isLoggedIn = req.get('Cookie').trim().split('=')[1];
    console.log(isLoggedIn);
    res.render('./auth/login', 
    { 
        pagetitle: "Login",
        path: "/login",
        isAuthenticated: isLoggedIn        
    });  
}

exports.postLogin = (req, res, next) => {
    res.setHeader('Set-Cookie', 'loggedIn=true'); //every request will have cookie attached
    console.log('login successful!');
    res.redirect('/');
}
