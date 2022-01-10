const path = require('path');
const fs = require('fs');
const https = require('https');

const express = require('express');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');
const csrf = require('csurf');
const cflash = require('connect-flash');
const multer = require('multer');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const errorController = require('./controllers/error');
const User = require('./models/user');

const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const authRouter = require('./routes/auth');

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.lrvxm.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}?retryWrites=true&w=majority`;

const app = express();

const sessionStore = new MongoDbStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});
const csrfProtection = csrf();

//const privateKey = fs.readFileSync('server.key');
//const certificate = fs.readFileSync('server.cert');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, 'undefined' + '-' + file.originalname); //new Date().toISOString()
    }
});

const fileFilter = (req, file, cb) => {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);
    }
};  

app.set('view engine', 'ejs');

app.use(helmet());
app.use(compression());

const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'), 
    { 
        flags: 'a' 
    });
app.use(morgan('combined', { stream: accessLogStream }));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')); //initialize multer to expect single image file called "image"
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
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

//console.log("USER: ", process.env.MONGO_USER);
mongoose.connect(MONGODB_URI)
.then(result => {
    //HTTPS EXAMPLE
    /*https.createServer({
        key: privateKey,
        cert: certificate
    }, app)
    .listen(process.env.PORT || 3000);*/
    //HTTP
    app.listen(process.env.PORT || 3000);
})
.catch(err => console.log(err));





