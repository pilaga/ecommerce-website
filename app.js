const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const rootDir = require('./utils/path_helper');

const adminData = require('./routes/admin');
const shopRouter = require('./routes/shop');

const app = express();

app.set('view engine', 'pug'); //register pug templating engine
//app.set('views', 'views'); //default folder is /views, so not required here

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRouter);

app.use((req, res, next) => {
    res.status(404)
    .render('404', { pagetitle: "Page not found!"});
});

app.listen(3000);

