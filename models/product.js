const db = require('../utils/database');
const Cart = require('./cart');

module.exports = class Product {
    constructor(id, title, price, description, image) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.description = description;
        this.image = image;
    }

    save() {       
        return db.execute('INSERT INTO product (title, price, description, image) VALUES (?, ?, ?, ?)',
        [
            this.title,
            this.price,
            this.description,
            this.image
        ]);
    }

    static deleteProductById(productId) {

    }

    static fetchAll() { //pass callback function as argument
        return db.execute('SELECT * FROM product');
    }

    static findById(id) {

    }
}