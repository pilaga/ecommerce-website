const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use('/', (req, res, next) => {
    //console.log('this always runs');
    next();
});

app.use('/users', (req, res, next) => {
    res.send('<h2>users page</h2>');
});

app.use('/add-product', (req, res, next) => {
    res.send('<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add product</button></form>');
})

app.post('/product', (req, res, next) => {
    console.log(req.body.title);
    res.redirect('/');
});

app.use('/', (req, res, next) => { 
    res.send('<h2>Hello from express</h2>');
});

app.listen(3000);

