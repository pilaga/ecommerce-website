const path = require('path');
const express = require('express');

const errorController = require('./controllers/error');
const mongo = require('./utils/database');

const adminRouter = require('./routes/admin');
//const shopRouter = require('./routes/shop');


const app = express();

app.set('view engine', 'ejs');
//app.set('views', 'views'); //default folder is /views, so not required here

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

/*app.use((req, res, next) => {
    user.findByPk(1)
    .then(user => {
        req.user = user;
        next();
    })
    .catch(err => {
        console.log(err);
    })
});*/

app.use('/admin', adminRouter);
//app.use(shopRouter);

app.use(errorController.get404);

mongo.connectDb(() => {
    app.listen(3000);
});




