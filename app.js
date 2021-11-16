const express = require('express');

const app = express();

app.use('/', (req, res, next) => {
    console.log('this always runs');
    next();
});

app.use('/add-product', (req, res, next) => {
    console.log('adding product middleware');
    res.send('<h2>add-product page</h2>');
});

app.use('/', (req, res, next) => { 
    console.log('in another middleware');
    res.send('<h2>Hello from express</h2>');
});

app.listen(3000);

