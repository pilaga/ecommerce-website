const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path_helper');

const filepath = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = (cb) => {
    //retrieve and parse file content
    fs.readFile(filepath, (err, data) => {
        if(err) {
            cb([]);
        } else {
            cb(JSON.parse(data));
        }
    });
}

module.exports = class Product {
    constructor(title, price, description, image) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.image = image;
    }

    save() {

        this.id = Math.random().toString();
        getProductsFromFile((products) => {
            //add new product
            products.push(this);             
            //write file again
            fs.writeFile(filepath, JSON.stringify(products), (err) => {
                console.log("Error:", err);
            });
        });
    }

    static fetchAll(cb) { //pass callback function as argument
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile((products) => {
            const product = products.find(item => item.id === id);
            cb(product);
        });
    }
}