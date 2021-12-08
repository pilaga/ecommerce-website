const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const csrf = require('csurf');
const cflash = require('connect-flash');
const multer = require('multer');

const errorController = require('./controllers/error');
const User = require('./models/user');

const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const authRouter = require('./routes/auth');

const MONGODB_URI = 'mongodb+srv://admin:password_02@cluster0.lrvxm.mongodb.net/shop?retryWrites=true&w=majority';

const app = express();
const sessionStore = new MongoDbStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '-' + file.originalname);
    }
});

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(multer({ storage: fileStorage }).single('image')); //initialize multer to expect single image file called "image"
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'my-secret-string',
    resave: false, //session won't be saved on every response - only if something changes
    saveUninitialized: false,
    store: sessionStore
}));
app.use(csrfProtection);
app.use(cflash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

//grab session user and turn into Mongoose User model
app.use((req, res, next) => {
    if(!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
    .then(user => {
        
        if(!user) {
            return next();
        }
        req.user = user;
        next();
    })
    .catch(err => {
        next(new Error(err));
    }); 
});



app.use('/admin', adminRouter);
app.use(shopRouter);
app.use(authRouter);

app.get('/500', errorController.get500);
app.use(errorController.get404);

// "nexting" an error will end up here
app.use((error, req, res, next) => {
    //res.redirect('/500');
    res.status(500)
    .render('500', 
        { 
            pagetitle: "An error occured!",
            path: "/500",
            isAuthenticated: req.session.isLoggedIn
        });
});

mongoose.connect(MONGODB_URI)
.then(result => {
    app.listen(3000);
})
.catch(err => console.log(err));





