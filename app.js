const path = require('path');
const express = require('express');

const errorController = require('./controllers/error');
const sequelize = require('./utils/database');
const Product = require('./models/product');
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
    User.findByPk(1)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => {
        console.log(err);
    })
});

app.use('/admin', adminRouter);
app.use(shopRouter);

app.use(errorController.get404);


//association between models
Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
});
User.hasMany(Product);

sequelize.sync({ force: true }) //sync({ force: true }) = forces overriding the tables
    .then(result => {
        return User.findByPk(1);        
    })
    .then(user => {
        if(!user) {
            return User.create({
                name: 'Pierre',
                email: 'pierre.lagadec@gmail.com'
            });
        }

        return Promise.resolve(user);
    })
    .then(user => {
        //console.log(user);
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });



