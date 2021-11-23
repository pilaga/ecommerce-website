const e = require('express');
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
    constructor(id, title, price, description, image) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.description = description;
        this.image = image;
    }

    save() {       
        getProductsFromFile((products) => {
            if(this.id) { //if product exists (id not null) - then update it
                const existingProductIndex = products.findIndex(item => item.id === this.id);
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                //write file again
                fs.writeFile(filepath, JSON.stringify(updatedProducts), (err) => {
                    console.log("Error:", err);
                });

            } else { //if product doesn't already exist  
                this.id = Math.random().toString();
                //add new product
                products.push(this);             
                //write file again
                fs.writeFile(filepath, JSON.stringify(products), (err) => {
                    console.log("Error:", err);
                });
            }
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