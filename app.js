const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const rootDir = require('./utils/path_helper');

const adminData = require('./routes/admin');
const shopRouter = require('./routes/shop');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));


/*app.use('/users', (req, res, next) => {
    res.send('<h2>users page</h2>');
});*/

app.use('/admin', adminData.routes);
app.use(shopRouter);

app.use((req, res, next) => {
    res.status(404)
    .sendFile(path.join(rootDir, 'views', '404.html'));
});

app.listen(3000);

