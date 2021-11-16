const express = require('express');
const bodyParser = require('body-parser');

const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));


/*app.use('/users', (req, res, next) => {
    res.send('<h2>users page</h2>');
});*/

app.use(adminRouter);
app.use(shopRouter);


app.listen(3000);

