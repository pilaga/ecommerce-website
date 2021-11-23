const path = require('path');
const express = require('express');

const errorController = require('./controllers/error');
const db = require('./utils/database');

const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');

const app = express();

app.set('view engine', 'ejs');
//app.set('views', 'views'); //default folder is /views, so not required here

db.execute('SELECT * FROM product')
    .then((result) => {
        console.log(result[0], result[1]);
    })
    .catch((err) => {
        console.log('Error:', err);
    });

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRouter);
app.use(shopRouter);

app.use(errorController.get404);

app.listen(3000);

