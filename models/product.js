const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path_helper');

module.exports = class Product {
    constructor(title) {
        this.title = title;
    }

    save() {
        const filepath = path.join(rootDir, 'data', 'products.json');

        //read file first
        fs.readFile(filepath, (err, data) => { 
            let products = [];   
            //if file exists, read existing products from file       
            if(!err) {   
                products = JSON.parse(data);
            }
            //add new product
            products.push(this);             
            //write file again
            fs.writeFile(filepath, JSON.stringify(products), (err) => {
                console.log("Error:", err);
            });
        });
    }

    static fetchAll() {
        const filepath = path.join(rootDir, 'data', 'products.json');

        //retrieve and parse file content
        fs.readFile(filepath, (err, data) => {
            if(err) {
                return [];
            }
            return JSON.parse(data);
        });
    }
}