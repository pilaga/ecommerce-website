const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => { 
    res.send('<h2>Wecome to the shop!</h2>');
});

module.exports = router;