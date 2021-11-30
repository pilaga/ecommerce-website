const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const mongoose = require('mongoose');

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

app.set('view engine', 'ejs');
//app.set('views', 'views'); //default folder is /views, so not required here

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'my-secret-string',
    resave: false, //session won't be saved on every response - only if something changes
    saveUninitialized: false,
    store: sessionStore
}));

//store user in request
app.use((req, res, next) => {
    User.findById('61a55d2061b0b8551446df25')
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => {
        console.log(err);
    });
});

app.use('/admin', adminRouter);
app.use(shopRouter);
app.use(authRouter);

app.use(errorController.get404);

mongoose.connect(MONGODB_URI)
.then(result => {
    //create dummy user if doesn't exist
    User.findOne().then(user => {
        if(!user) {
            const user = new User({
                name: 'Pierre',
                email: 'pierre.lagadec@gmail.com',
                cart: {
                    items: []
                }
            });
            user.save();
        }
    })
    app.listen(3000);
})
.catch(err => console.log(err));





