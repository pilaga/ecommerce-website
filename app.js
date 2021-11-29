const path = require('path');
const express = require('express');

const errorController = require('./controllers/error');
const mongoose = require('mongoose');
const User = require('./models/user');

const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');


const app = express();

app.set('view engine', 'ejs');
//app.set('views', 'views'); //default folder is /views, so not required here

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('61a03ef99146dac3693ce770')
    .then(user => {
        //console.log(user);
        //console.log(user._id);
        req.user = new User(user.name, user.email, user.cart, user._id);
        next();
    })
    .catch(err => {
        console.log(err);
    });
});

app.use('/admin', adminRouter);
app.use(shopRouter);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://admin:password_02@cluster0.lrvxm.mongodb.net/shop?retryWrites=true&w=majority')
.then(result => {
    app.listen(3000);
})
.catch(err => console.log(err));





