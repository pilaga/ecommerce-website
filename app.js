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

app.use(errorController.get404);

mongoose.connect('mongodb+srv://admin:password_02@cluster0.lrvxm.mongodb.net/shop?retryWrites=true&w=majority')
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





